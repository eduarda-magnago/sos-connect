import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsDateString,
  Min,
} from 'class-validator';
import { MissionCategory } from '../schemas/mission.schema';

export class CreateMissionDto {
  @IsString()
  @IsNotEmpty()
  support_unit_id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(MissionCategory)
  category: MissionCategory;

  @IsNumber()
  @Min(1)
  volunteers_needed: number;

  @IsDateString()
  date: string;
}
