import { IsEnum } from 'class-validator';
import { MissionVolunteerStatus } from '../schemas/mission-volunteer.schema';

export class UpdateMissionVolunteerDto {
  @IsEnum(MissionVolunteerStatus)
  status!: MissionVolunteerStatus;
}