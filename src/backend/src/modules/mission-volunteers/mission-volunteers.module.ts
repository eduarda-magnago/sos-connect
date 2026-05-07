import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MissionVolunteersController } from './mission-volunteers.controller';
import { MissionVolunteersService } from './mission-volunteers.service';
import {
  MissionVolunteer,
  MissionVolunteerSchema,
} from './schemas/mission-volunteer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MissionVolunteer.name, schema: MissionVolunteerSchema },
    ]),
  ],
  controllers: [MissionVolunteersController],
  providers: [MissionVolunteersService],
  exports: [MissionVolunteersService],
})
export class MissionVolunteersModule {}