import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, now } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  avatar: string;

  @Prop({ default: '' })
  resedCode: string;

  @Prop({ required: true })
  isAdmin: boolean;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: now() })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
