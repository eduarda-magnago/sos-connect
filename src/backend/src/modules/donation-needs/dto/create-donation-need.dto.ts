import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
} from 'class-validator';
import { DonationPriority } from '../schemas/donation-need.schema';

export class CreateDonationNeedDto {
  @IsString()
  @IsNotEmpty()
  item_name: string;

  @IsNumber()
  @Min(1)
  quantity_needed: number;

  @IsEnum(DonationPriority)
  @IsOptional()
  priority?: DonationPriority;
}