import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/user.schema';

export type TokensDocument = HydratedDocument<Tokens>;

@Schema()
export class Tokens {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ required: true, unique: true })
  refreshToken: string;
}

export const TokensSchema = SchemaFactory.createForClass(Tokens);
