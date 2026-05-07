import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  MissionVolunteer,
  MissionVolunteerDocument,
  MissionVolunteerStatus,
} from './schemas/mission-volunteer.schema';
import { CreateMissionVolunteerDto } from './dto/create-mission-volunteer.dto';
import { UpdateMissionVolunteerDto } from './dto/update-mission-volunteer.dto';

@Injectable()
export class MissionVolunteersService {
  constructor(
    @InjectModel(MissionVolunteer.name)
    private readonly missionVolunteerModel: Model<MissionVolunteerDocument>,
  ) {}

  async create(createDto: CreateMissionVolunteerDto, userId: string) {
    const existing = await this.missionVolunteerModel.findOne({
      mission_id: new Types.ObjectId(createDto.mission_id),
      user_id: new Types.ObjectId(userId),
    });

    if (existing) {
      throw new ConflictException(
        'Usuário já se candidatou para esta missão',
      );
    }

    return this.missionVolunteerModel.create({
      mission_id: new Types.ObjectId(createDto.mission_id),
      user_id: new Types.ObjectId(userId),
      status: MissionVolunteerStatus.PENDING,
    });
  }

  async findAll() {
    return this.missionVolunteerModel
      .find()
      .populate('mission_id')
      .populate('user_id')
      .exec();
  }

  async findOne(id: string) {
    const item = await this.missionVolunteerModel
      .findById(id)
      .populate('mission_id')
      .populate('user_id')
      .exec();

    if (!item) {
      throw new NotFoundException('Candidatura não encontrada');
    }

    return item;
  }

  async update(id: string, updateDto: UpdateMissionVolunteerDto) {
    const updated = await this.missionVolunteerModel.findByIdAndUpdate(
      id,
      updateDto,
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Candidatura não encontrada');
    }

    return updated;
  }

  async remove(id: string) {
    const deleted = await this.missionVolunteerModel.findByIdAndDelete(id);

    if (!deleted) {
      throw new NotFoundException('Candidatura não encontrada');
    }

    return;
  }
}