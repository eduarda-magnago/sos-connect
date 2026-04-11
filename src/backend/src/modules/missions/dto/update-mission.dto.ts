import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDateString,
  IsArray,
  IsMongoId,
  Min,
} from 'class-validator';
import { MissionCategory, MissionStatus } from '../schemas/mission.schema';

export class UpdateMissionDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(MissionCategory)
  @IsOptional()
  category?: MissionCategory;

  @IsEnum(MissionStatus)
  @IsOptional()
  status?: MissionStatus;

  @IsNumber()
  @Min(1)
  @IsOptional()
  volunteers_needed?: number;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  volunteer_ids?: string[];

  @IsDateString()
  @IsOptional()
  date?: string;
}
