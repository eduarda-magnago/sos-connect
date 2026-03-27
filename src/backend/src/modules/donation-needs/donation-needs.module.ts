import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DonationNeedsController } from './donation-needs.controller';
import { DonationNeedsService } from './donation-needs.service';
import { DonationNeed, DonationNeedSchema } from './schemas/donation-need.schema';
import { SupportUnitsModule } from '../support-units/support-units.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DonationNeed.name, schema: DonationNeedSchema },
    ]),
    SupportUnitsModule,
  ],
  controllers: [DonationNeedsController],
  providers: [DonationNeedsService],
  exports: [DonationNeedsService],
})
export class DonationNeedsModule {}