import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsDateString,
  IsArray,
  IsMongoId,
  IsOptional,
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

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  volunteer_ids?: string[];

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  contact_phone?: string;

  @IsString()
  @IsOptional()
  delivery_time?: string;
}
