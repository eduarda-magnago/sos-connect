import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { DonationNeedsService } from './donation-needs.service';
import { CreateDonationNeedDto } from './dto/create-donation-need.dto';
import { UpdateDonationNeedDto } from './dto/update-donation-need.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { UserDocument } from '../users/schemas/user.schema';

@Controller()
export class DonationNeedsController {
  constructor(private readonly donationNeedsService: DonationNeedsService) {}

  // POST /api/support-units/:unitId/donation-needs
  @Post('support-units/:unitId/donation-needs')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('unitId') unitId: string,
    @Body() createDto: CreateDonationNeedDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.donationNeedsService.create(unitId, createDto, user._id.toString());
  }

  // GET /api/donation-needs
  /*@Get('donation-needs')
  findAll() {
    return this.donationNeedsService.findAll();
  }*/

  // GET /api/donation-needs/:id
  @Get('donation-needs/:id')
  findOne(@Param('id') id: string) {
    return this.donationNeedsService.findOne(id);
  }

  // PUT /api/donation-needs/:id
  @Put('donation-needs/:id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateDonationNeedDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.donationNeedsService.update(id, updateDto, user._id.toString());
  }

  // DELETE /api/donation-needs/:id
  @Delete('donation-needs/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
  ) {
    return this.donationNeedsService.remove(id, user._id.toString());
  }
  
//achar doações por unidade de apoio
  @Get('donation-needs')
    findAll(
      @Query('support_unit_id') supportUnitId?: string,
    ) {
      return this.donationNeedsService.findAll({
        support_unit_id: supportUnitId,
      });
    }
}
