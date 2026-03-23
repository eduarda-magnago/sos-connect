import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
  ValidateNested,
  Min,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SupportUnitStatus } from '../schemas/support-unit.schema';

class LocationDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

class ContactDto {
  @IsString()
  email: string;

  @IsString()
  phone: string;
}

export class UpdateSupportUnitDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @ValidateNested()
  @Type(() => ContactDto)
  @IsOptional()
  contact?: ContactDto;

  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;

  @IsNumber()
  @Min(1)
  @IsOptional()
  capacity?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  current_occupancy?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  services_available?: string[];

  @IsEnum(SupportUnitStatus)
  @IsOptional()
  status?: SupportUnitStatus;

  @IsBoolean()
  @IsOptional()
  validated?: boolean;
}