import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SupportUnit, SupportUnitDocument } from './schemas/support-unit.schema';
import { CreateSupportUnitDto } from './dto/create-support-unit.dto';
import { UpdateSupportUnitDto } from './dto/update-support-unit.dto';

@Injectable()
export class SupportUnitsService {
  constructor(
    @InjectModel(SupportUnit.name)
    private supportUnitModel: Model<SupportUnitDocument>,
  ) {}

  async create(
    createDto: CreateSupportUnitDto,
    userId: string,
  ): Promise<SupportUnitDocument> {
    const existing = await this.supportUnitModel.findOne({
      CNPJ: createDto.CNPJ,
    });

    if (existing) {
      throw new ConflictException('CNPJ já cadastrado');
    }

    const unit = new this.supportUnitModel({
      ...createDto,
      location: {
        type: 'Point',
        coordinates: [createDto.location.lng, createDto.location.lat],
      },
      support_unit_user_id: userId,
      validated: false,
    });

    return unit.save();
  }

  async findAll(filters?: {
    status?: string;
    services?: string[];
    lat?: number;
    lng?: number;
    radius?: number;
  }): Promise<SupportUnitDocument[]> {
    const query: any = { validated: true };

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.services && filters.services.length > 0) {
      query.services_available = { $in: filters.services };
    }

    if (filters?.lat && filters?.lng) {
      const radius = filters.radius || 10000;
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [filters.lng, filters.lat],
          },
          $maxDistance: radius,
        },
      };
    }

    return this.supportUnitModel.find(query).exec();
  }

  async findOne(id: string): Promise<SupportUnitDocument> {
    const unit = await this.supportUnitModel.findById(id).exec();

    if (!unit) {
      throw new NotFoundException('Unidade de apoio não encontrada');
    }

    return unit;
  }

  async update(
    id: string,
    updateDto: UpdateSupportUnitDto,
    userId: string,
  ): Promise<SupportUnitDocument> {
    const unit = await this.findOne(id);

    if (unit.support_unit_user_id.toString() !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para editar esta unidade',
      );
    }

    const updated = await this.supportUnitModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Unidade de apoio não encontrada');
    }

    return updated;
  }

  async validate(
    id: string,
    approved: boolean,
  ): Promise<SupportUnitDocument> {
    const unit = await this.findOne(id);
    unit.validated = approved;
    return unit.save();
  }

  async findPending(): Promise<SupportUnitDocument[]> {
    return this.supportUnitModel.find({ validated: false }).exec();
  }

  async remove(id: string, userId: string): Promise<void> {
    const unit = await this.findOne(id);

    if (unit.support_unit_user_id.toString() !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para deletar esta unidade',
      );
    }

    await this.supportUnitModel.findByIdAndDelete(id).exec();
  }
}