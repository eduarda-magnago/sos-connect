import { Controller, Get, Query } from '@nestjs/common'
import { GeocodingService } from './geocoding.service'

@Controller('geocoding')
export class GeocodingController {
  constructor(private readonly geocodingService: GeocodingService) {}

  @Get('reverse')
  async reverse(@Query('lat') lat: string, @Query('lng') lng: string) {
    return this.geocodingService.reverseGeocode(parseFloat(lat), parseFloat(lng))
  }
}