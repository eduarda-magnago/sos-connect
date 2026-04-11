import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  StreamableFile,
  Header,
} from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { UserDocument } from '../users/schemas/user.schema';

@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createDto: CreateCertificateDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.certificatesService.create(createDto, user._id.toString());
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMine(@CurrentUser() user: UserDocument) {
    return this.certificatesService.findMine(user._id.toString());
  }

  @Get(':id/download')
  @UseGuards(JwtAuthGuard)
  @Header('Content-Type', 'application/pdf')
  async download(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
  ): Promise<StreamableFile> {
    const cert = await this.certificatesService.findOneForUser(
      id,
      user._id.toString(),
      user.role,
    );
    const { buffer, filename } =
      await this.certificatesService.buildPdfBuffer(cert);

    return new StreamableFile(buffer, {
      type: 'application/pdf',
      disposition: `attachment; filename="${filename}"`,
    });
  }
}
