import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserRole {
  VICTIM       = 'victim',
  VOLUNTEER    = 'volunteer',
  SUPPORT_UNIT = 'support_unit',
  ADMIN        = 'admin',
}

@Schema({
  timestamps: true,
  collection: 'users',
  toJSON: {
    transform: (_doc: unknown, ret: Record<string, unknown>) => {
      delete ret['passwordHash'];
      delete ret['__v'];
      return ret;
    },
  },
})

export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.VICTIM })
  role: UserRole;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ trim: true })
  fcm_token?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ skills: 1 });