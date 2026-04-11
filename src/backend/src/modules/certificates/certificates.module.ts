import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CertificatesController } from './certificates.controller';
import { CertificatesService } from './certificates.service';
import { Certificate, CertificateSchema } from './schemas/certificate.schema';
import { MissionsModule } from '../missions/missions.module';
import { SupportUnitsModule } from '../support-units/support-units.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Certificate.name, schema: CertificateSchema },
    ]),
    MissionsModule,
    SupportUnitsModule,
    UsersModule,
  ],
  controllers: [CertificatesController],
  providers: [CertificatesService],
  exports: [CertificatesService],
})
export class CertificatesModule {}
