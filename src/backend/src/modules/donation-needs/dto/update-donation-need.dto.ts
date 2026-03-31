 import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
} from 'class-validator';
import { DonationPriority, DonationStatus } from '../schemas/donation-need.schema';

export class UpdateDonationNeedDto {
  @IsString()
  @IsOptional()
  item_name?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity_needed?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity_received?: number;

  @IsEnum(DonationPriority)
  @IsOptional()
  priority?: DonationPriority;

  @IsEnum(DonationStatus)
  @IsOptional()
  status?: DonationStatus;
}