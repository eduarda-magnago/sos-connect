import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { SupportUnitsModule } from './modules/support-units/support-units.module';
import { DonationNeedsModule } from './modules/donation-needs/donation-needs.module';
import { MissionsModule } from './modules/missions/missions.module';
import { MissionVolunteersModule } from './modules/mission-volunteers/mission-volunteers.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { GeocodingModule } from './modules/geocoding/geocoding.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().required(),
        PORT: Joi.number().default(3000),
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    SupportUnitsModule,
    DonationNeedsModule,
    MissionsModule,
    MissionVolunteersModule,
    NotificationsModule,
    CertificatesModule,
    GeocodingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}