import { IsMongoId, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateCertificateDto {
  @IsMongoId()
  @IsNotEmpty()
  mission_id: string;

  @IsMongoId()
  @IsNotEmpty()
  volunteer_user_id: string;

  @IsNumber()
  @Min(1)
  hours: number;
}
