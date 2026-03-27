import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose'; 

export type DonationNeedDocument = DonationNeed & Document;

export enum DonationPriority {
  LOW      = 'low',
  MEDIUM   = 'medium',
  HIGH     = 'high',
  CRITICAL = 'critical',
}

 export enum DonationStatus {
  PENDING             = 'pending',
  PARTIALLY_FULFILLED = 'partially_fulfilled',
  FULFILLED           = 'fulfilled',
  CANCELLED           = 'cancelled',
}

 @Schema({
  timestamps: true,
  collection: 'donation_needs',
  toJSON: {
    transform: (_doc: unknown, ret: Record<string, unknown>) => {
      delete ret['__v'];
      return ret;
    },
  },
})

 export class DonationNeed {
  @Prop({ type: Types.ObjectId, ref: 'SupportUnit', required: true })
  support_unit_id: Types.ObjectId;

  @Prop({ required: true, trim: true })
  item_name: string;

  @Prop({ required: true, min: 1 })
  quantity_needed: number;

  @Prop({ default: 0, min: 0 })
  quantity_received: number;

  @Prop({ enum: DonationPriority, default: DonationPriority.MEDIUM })
  priority: DonationPriority;

  @Prop({ enum: DonationStatus, default: DonationStatus.PENDING })
  status: DonationStatus;
}

export const DonationNeedSchema = SchemaFactory.createForClass(DonationNeed);

DonationNeedSchema.index({ support_unit_id: 1 });
DonationNeedSchema.index({ support_unit_id: 1, status: 1 });
DonationNeedSchema.index({ priority: 1, status: 1 });  