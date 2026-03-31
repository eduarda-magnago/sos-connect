import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MissionsService } from './missions.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { UserDocument } from '../users/schemas/user.schema';

@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createDto: CreateMissionDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.missionsService.create(createDto, user._id.toString());
  }

  @Get()
  findAll(
    @Query('support_unit_id') supportUnitId?: string,
    @Query('status') status?: string,
    @Query('category') category?: string,
  ) {
    return this.missionsService.findAll({
      support_unit_id: supportUnitId,
      status,
      category,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.missionsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateMissionDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.missionsService.update(id, updateDto, user._id.toString());
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
  ) {
    return this.missionsService.remove(id, user._id.toString());
  }
}
