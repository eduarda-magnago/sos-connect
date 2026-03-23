import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SupportUnitsController } from './support-units.controller';
import { SupportUnitsService } from './support-units.service';
import { SupportUnit, SupportUnitSchema } from './schemas/support-unit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportUnit.name, schema: SupportUnitSchema },
    ]),
  ],
  controllers: [SupportUnitsController],
  providers: [SupportUnitsService],
  exports: [SupportUnitsService],
})
export class SupportUnitsModule {}