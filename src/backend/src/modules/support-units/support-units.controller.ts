import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Patch,
  Delete,
} from '@nestjs/common';
import { SupportUnitsService } from './support-units.service';
import { CreateSupportUnitDto } from './dto/create-support-unit.dto';
import { UpdateSupportUnitDto } from './dto/update-support-unit.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { UserDocument } from '../users/schemas/user.schema';

@Controller('support-units')
export class SupportUnitsController {
  constructor(private readonly supportUnitsService: SupportUnitsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createDto: CreateSupportUnitDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.supportUnitsService.create(createDto, user._id.toString());
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('services') services?: string,
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
    @Query('radius') radius?: string,
  ) {
    return this.supportUnitsService.findAll({
      status,
      services: services ? services.split(',') : undefined,
      lat: lat ? parseFloat(lat) : undefined,
      lng: lng ? parseFloat(lng) : undefined,
      radius: radius ? parseInt(radius) : undefined,
    });
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard)
  findPending() {
    return this.supportUnitsService.findPending();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supportUnitsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateSupportUnitDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.supportUnitsService.update(id, updateDto, user._id.toString());
  }

  @Patch(':id/validate')
  @UseGuards(JwtAuthGuard)
  validate(
    @Param('id') id: string,
    @Body('approved') approved: boolean,
  ) {
    return this.supportUnitsService.validate(id, approved);
  }
  
   @Delete(':id')
   @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
 ) {
    return this.supportUnitsService.remove(id, user._id.toString());
  }
}