import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MissionDocument = Mission & Document;

export enum MissionStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum MissionCategory {
  COZINHA = 'cozinha',
  LIMPEZA = 'limpeza',
  MEDICO = 'medico',
  TRANSPORTE = 'transporte',
  CUIDADO_INFANTIL = 'cuidado_infantil',
  CONSTRUCAO = 'construcao',
  DISTRIBUICAO = 'distribuicao',
  OUTRO = 'outro',
}

@Schema({
  timestamps: true,
  collection: 'missions',
  toJSON: {
    transform: (_doc: unknown, ret: Record<string, unknown>) => {
      delete ret['__v'];
      return ret;
    },
  },
})
export class Mission {
  @Prop({ type: Types.ObjectId, ref: 'SupportUnit', required: true })
  support_unit_id: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ enum: MissionCategory, required: true })
  category: MissionCategory;

  @Prop({ enum: MissionStatus, default: MissionStatus.PENDING })
  status: MissionStatus;

  @Prop({ required: true, min: 1 })
  volunteers_needed: number;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  volunteer_ids: Types.ObjectId[];

  @Prop({ required: true })
  date: Date;
}

export const MissionSchema = SchemaFactory.createForClass(Mission);

MissionSchema.index({ support_unit_id: 1 });
MissionSchema.index({ status: 1 });
MissionSchema.index({ category: 1 });
MissionSchema.index({ date: 1 });
