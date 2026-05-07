import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MissionVolunteersService } from './mission-volunteers.service';
import { CreateMissionVolunteerDto } from './dto/create-mission-volunteer.dto';
import { UpdateMissionVolunteerDto } from './dto/update-mission-volunteer.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { UserDocument } from '../users/schemas/user.schema';

@Controller('mission-volunteers')
export class MissionVolunteersController {
  constructor(
    private readonly missionVolunteersService: MissionVolunteersService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createDto: CreateMissionVolunteerDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.missionVolunteersService.create(
      createDto,
      user._id.toString(),
    );
  }

  @Get()
  findAll() {
    return this.missionVolunteersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.missionVolunteersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateMissionVolunteerDto,
  ) {
    return this.missionVolunteersService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.missionVolunteersService.remove(id);
  }
}