import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CloudinaryService } from '../services/cloudinary.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('image')
  @UseGuards(JwtAuthGuard)
  async uploadImage(@Body() body: { base64: string; folder?: string }) {
    const url = await this.cloudinaryService.uploadImage(
      body.base64,
      body.folder || 'general',
    );

    return { url };
  }
}
