import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SupportUnitDocument = SupportUnit & Document;

export enum SupportUnitStatus {
  OPEN   = 'open',
  FULL   = 'full',
  CLOSED = 'closed',
}

@Schema({ _id: false })
class Location {
  @Prop({ type: String, enum: ['Point'], default: 'Point' })
  type: string;

  @Prop({ type: [Number], required: true })
  coordinates: number[];
}
const LocationSchema = SchemaFactory.createForClass(Location);

@Schema({ _id: false })
class Contact {
  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;
}
const ContactSchema = SchemaFactory.createForClass(Contact);

@Schema({
  timestamps: true,
  collection: 'support_units',
  toJSON: {
    transform: (_doc: unknown, ret: Record<string, unknown>) => {
      delete ret['__v'];
      return ret;
    },
  },
})
export class SupportUnit {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  support_unit_user_id: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true })
  CNPJ: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ type: ContactSchema, required: true })
  contact: Contact;

  @Prop({ type: LocationSchema, required: true })
  location: Location;

  @Prop({ required: true, min: 1 })
  capacity: number;

  @Prop({ default: 0, min: 0 })
  current_occupancy: number;

  @Prop({ type: [String], default: [] })
  services_available: string[];

  @Prop({ enum: SupportUnitStatus, default: SupportUnitStatus.OPEN })
  status: SupportUnitStatus;

  @Prop({ default: false })
  validated: boolean;
}

export const SupportUnitSchema = SchemaFactory.createForClass(SupportUnit);

SupportUnitSchema.index({ location: '2dsphere' });
SupportUnitSchema.index({ status: 1 });
SupportUnitSchema.index({ validated: 1 });
SupportUnitSchema.index({ support_unit_user_id: 1 });
SupportUnitSchema.index({ CNPJ: 1 }, { unique: true });