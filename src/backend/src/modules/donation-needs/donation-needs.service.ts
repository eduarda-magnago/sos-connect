import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DonationNeed, DonationNeedDocument } from './schemas/donation-need.schema';
import { CreateDonationNeedDto } from './dto/create-donation-need.dto';
import { UpdateDonationNeedDto } from './dto/update-donation-need.dto';
import { SupportUnitsService } from '../support-units/support-units.service';

@Injectable()
export class DonationNeedsService {
  constructor(
    @InjectModel(DonationNeed.name)
    private donationNeedModel: Model<DonationNeedDocument>,
    private supportUnitsService: SupportUnitsService,
  ) {}

  async create(
    unitId: string,
    createDto: CreateDonationNeedDto,
    userId: string,
  ): Promise<DonationNeedDocument> {
    const unit = await this.supportUnitsService.findOne(unitId);

    if (unit.support_unit_user_id.toString() !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para adicionar doações nesta unidade',
      );
    }

    const donation = new this.donationNeedModel({
      ...createDto,
      support_unit_id: unitId,
    });

    return donation.save();
  }

  /*async findAll(): Promise<DonationNeedDocument[]> {
    return this.donationNeedModel.find().exec();
  }*/

  async findOne(id: string): Promise<DonationNeedDocument> {
    const donation = await this.donationNeedModel.findById(id).exec();

    if (!donation) {
      throw new NotFoundException('Necessidade de doação não encontrada');
    }

    return donation;
  }

  async update(
    id: string,
    updateDto: UpdateDonationNeedDto,
    userId: string,
  ): Promise<DonationNeedDocument> {
    const donation = await this.findOne(id);
    const unit = await this.supportUnitsService.findOne(
      donation.support_unit_id.toString(),
    );

    if (unit.support_unit_user_id.toString() !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar esta doação',
      );
    }

    const updated = await this.donationNeedModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Necessidade de doação não encontrada');
    }

    return updated;
  }

  async remove(id: string, userId: string): Promise<void> {
    const donation = await this.findOne(id);
    const unit = await this.supportUnitsService.findOne(
      donation.support_unit_id.toString(),
    );

    if (unit.support_unit_user_id.toString() !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para remover esta doação',
      );
    }

    await this.donationNeedModel.findByIdAndDelete(id).exec();
  }

  //achar doaçoes por unidade de apoio
  async findAll(filters?: {
    support_unit_id?: string;
  }): Promise<DonationNeedDocument[]> {
    const query: Record<string, unknown> = {};

    if (filters?.support_unit_id) {
      query.support_unit_id = filters.support_unit_id;
    }
    
    return this.donationNeedModel.find(query).sort({ date: 1 }).exec();
  }
}


