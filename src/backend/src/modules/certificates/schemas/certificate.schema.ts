import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CertificateDocument = Certificate & Document;

@Schema({
  timestamps: true,
  collection: 'certificates',
  toJSON: {
    transform: (_doc: unknown, ret: Record<string, unknown>) => {
      delete ret['__v'];
      return ret;
    },
  },
})
export class Certificate {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Mission', required: true })
  mission_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'SupportUnit', required: true })
  support_unit_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  issued_by: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  hours: number;

  @Prop({ required: true, unique: true, trim: true })
  certificate_code: string;

  @Prop({ required: true })
  issued_at: Date;
}

export const CertificateSchema = SchemaFactory.createForClass(Certificate);

CertificateSchema.index({ mission_id: 1, user_id: 1 }, { unique: true });
CertificateSchema.index({ certificate_code: 1 }, { unique: true });
CertificateSchema.index({ user_id: 1 });
