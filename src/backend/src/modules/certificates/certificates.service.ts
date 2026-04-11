import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import PDFDocument from 'pdfkit';
import { randomBytes } from 'crypto';
import { Certificate, CertificateDocument } from './schemas/certificate.schema';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { MissionsService } from '../missions/missions.service';
import { SupportUnitsService } from '../support-units/support-units.service';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectModel(Certificate.name)
    private certificateModel: Model<CertificateDocument>,
    private readonly missionsService: MissionsService,
    private readonly supportUnitsService: SupportUnitsService,
    private readonly usersService: UsersService,
  ) {}

  private generateCertificateCode(): string {
    const year = new Date().getFullYear();
    const suffix = randomBytes(4).toString('hex').toUpperCase();
    return `CERT-${year}-${suffix}`;
  }

  async create(
    dto: CreateCertificateDto,
    issuerUserId: string,
  ): Promise<CertificateDocument> {
    const mission = await this.missionsService.findOne(dto.mission_id);

    const unit = await this.supportUnitsService.findOne(
      mission.support_unit_id.toString(),
    );

    if (unit.support_unit_user_id.toString() !== issuerUserId) {
      throw new ForbiddenException(
        'Você não tem permissão para emitir certificados desta missão',
      );
    }

    const volunteerIds = mission.volunteer_ids.map((id) => id.toString());
    if (!volunteerIds.includes(dto.volunteer_user_id)) {
      throw new ForbiddenException(
        'O voluntário não está registrado nesta missão',
      );
    }

    await this.usersService.findOne(dto.volunteer_user_id);

    const existing = await this.certificateModel
      .findOne({
        mission_id: new Types.ObjectId(dto.mission_id),
        user_id: new Types.ObjectId(dto.volunteer_user_id),
      })
      .exec();

    if (existing) {
      return existing;
    }

    let certificate_code = this.generateCertificateCode();
    for (let attempt = 0; attempt < 5; attempt++) {
      const clash = await this.certificateModel
        .findOne({ certificate_code })
        .exec();
      if (!clash) break;
      certificate_code = this.generateCertificateCode();
    }

    const issued_at = new Date();
    const cert = new this.certificateModel({
      user_id: dto.volunteer_user_id,
      mission_id: dto.mission_id,
      support_unit_id: mission.support_unit_id,
      issued_by: issuerUserId,
      hours: dto.hours,
      certificate_code,
      issued_at,
    });

    return cert.save();
  }

  async findMine(userId: string): Promise<CertificateDocument[]> {
    return this.certificateModel
      .find({ user_id: userId })
      .sort({ issued_at: -1 })
      .exec();
  }

  async findOneForUser(
    id: string,
    userId: string,
    role: UserRole,
  ): Promise<CertificateDocument> {
    const cert = await this.certificateModel.findById(id).exec();

    if (!cert) {
      throw new NotFoundException('Certificado não encontrado');
    }

    const isOwner = cert.user_id.toString() === userId;
    const isAdmin = role === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este certificado',
      );
    }

    return cert;
  }

  async buildPdfBuffer(
    cert: CertificateDocument,
  ): Promise<{ buffer: Buffer; filename: string }> {
    const volunteer = await this.usersService.findOne(
      cert.user_id.toString(),
    );
    const mission = await this.missionsService.findOne(
      cert.mission_id.toString(),
    );
    const unit = await this.supportUnitsService.findOne(
      cert.support_unit_id.toString(),
    );

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20).text('SOS Connect', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(14).text('Certificado de participação', { align: 'center' });
      doc.moveDown(2);

      doc.fontSize(11);
      doc.text(
        `Certificamos que ${volunteer.name} participou como voluntário na missão "${mission.title}", ` +
          `vinculada à unidade de apoio "${unit.name}", com carga horária de ${cert.hours} hora(s).`,
        { align: 'justify' },
      );
      doc.moveDown(2);

      doc.text(`Código de verificação: ${cert.certificate_code}`);
      doc.text(
        `Emitido em: ${cert.issued_at.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })}`,
      );

      doc.end();
    });

    const filename = `certificado-${cert.certificate_code}.pdf`;
    return { buffer, filename };
  }
}
