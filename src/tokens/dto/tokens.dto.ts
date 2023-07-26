import { Document } from 'mongoose';
import { User } from 'src/user/user.schema';

export interface IToken extends Document {
  user: User;
  refreshToken: string;
}

export interface IJwtTokens {
  accessToken: string;
  refreshToken: string;
}
