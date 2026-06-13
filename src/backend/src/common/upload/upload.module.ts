import { Module } from '@nestjs/common';

import { CloudinaryService } from '../services/cloudinary.service';
import { UploadController } from './upload.controller';

@Module({
  controllers: [UploadController],
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class UploadModule {}
