import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.getOrThrow<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.getOrThrow<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(base64: string, folder: string): Promise<string> {
    const result = await cloudinary.uploader.upload(base64, {
      folder: `sos-connect/${folder}`,
      resource_type: 'image',
      transformation: [
        { width: 800, height: 600, crop: 'fill', quality: 'auto' },
      ],
    });

    return result.secure_url;
  }

  async deleteImage(url: string): Promise<void> {
    const publicId = this.extractPublicId(url);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  }

  private extractPublicId(url: string): string | null {
    const match = url.match(/\/sos-connect\/(.+)\.[a-z]+$/i);
    return match ? `sos-connect/${match[1]}` : null;
  }
}
