import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Mission, MissionDocument } from './schemas/mission.schema';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { SupportUnit, SupportUnitDocument } from '../support-units/schemas/support-unit.schema';

@Injectable()
export class MissionsService {
  constructor(
    @InjectModel(Mission.name)
    private missionModel: Model<MissionDocument>,
    @InjectModel(SupportUnit.name)
    private supportUnitModel: Model<SupportUnitDocument>,
  ) {}

  async create(
    createDto: CreateMissionDto,
    userId: string,
  ): Promise<MissionDocument> {
    const unit = await this.supportUnitModel
      .findById(createDto.support_unit_id)
      .exec();

    if (!unit) {
      throw new NotFoundException('Unidade de apoio não encontrada');
    }

    if (unit.support_unit_user_id.toString() !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para criar missões nesta unidade',
      );
    }

    const mission = new this.missionModel(createDto);
    return mission.save();
  }

  async findAll(filters?: {
    support_unit_id?: string;
    status?: string;
    category?: string;
  }): Promise<MissionDocument[]> {
    const query: Record<string, unknown> = {};

    if (filters?.support_unit_id) {
      query.support_unit_id = filters.support_unit_id;
    }

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.category) {
      query.category = filters.category;
    }

    return this.missionModel.find(query).sort({ date: 1 }).exec();
  }

  async findOne(id: string): Promise<MissionDocument> {
    const mission = await this.missionModel.findById(id).exec();

    if (!mission) {
      throw new NotFoundException('Missão não encontrada');
    }

    return mission;
  }

  async update(
    id: string,
    updateDto: UpdateMissionDto,
    userId: string,
  ): Promise<MissionDocument> {
    const mission = await this.findOne(id);

    const unit = await this.supportUnitModel
      .findById(mission.support_unit_id)
      .exec();

    if (!unit || unit.support_unit_user_id.toString() !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para editar esta missão',
      );
    }

    const updated = await this.missionModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Missão não encontrada');
    }

    return updated;
  }

  async remove(id: string, userId: string): Promise<void> {
    const mission = await this.findOne(id);

    const unit = await this.supportUnitModel
      .findById(mission.support_unit_id)
      .exec();

    if (!unit || unit.support_unit_user_id.toString() !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para deletar esta missão',
      );
    }

    await this.missionModel.findByIdAndDelete(id).exec();
  }
}
