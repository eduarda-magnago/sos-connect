import { IsMongoId } from 'class-validator';

export class CreateMissionVolunteerDto {
  @IsMongoId()
  mission_id!: string;
}