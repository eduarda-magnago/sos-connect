import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MissionVolunteerDocument = MissionVolunteer & Document;

export enum MissionVolunteerStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  WITHDRAWN = 'withdrawn',
}

@Schema({
  timestamps: true,
  collection: 'mission_volunteers',
  toJSON: {
    transform: (_doc: unknown, ret: Record<string, unknown>) => {
      delete ret['__v'];
      return ret;
    },
  },
})
export class MissionVolunteer {
  @Prop({ type: Types.ObjectId, ref: 'Mission', required: true })
  mission_id!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id!: Types.ObjectId;

  @Prop({
    enum: MissionVolunteerStatus,
    default: MissionVolunteerStatus.PENDING,
  })
  status!: MissionVolunteerStatus;
}

export const MissionVolunteerSchema =
  SchemaFactory.createForClass(MissionVolunteer);

MissionVolunteerSchema.index({ mission_id: 1 });
MissionVolunteerSchema.index({ user_id: 1 });
MissionVolunteerSchema.index({ status: 1 });
MissionVolunteerSchema.index({ mission_id: 1, user_id: 1 }, { unique: true });