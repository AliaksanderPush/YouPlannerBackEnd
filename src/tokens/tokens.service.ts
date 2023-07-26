import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sign, verify } from 'jsonwebtoken';
import { IUserPayload } from 'src/user/dto/user.dto';
import { IJwtTokens } from './dto/tokens.dto';
import { Tokens, TokensDocument } from './tokens.schema';

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(Tokens.name)
    private readonly tokensModel: Model<TokensDocument>,
  ) {}

  generateTokens(email: string, isAdmin: boolean): IJwtTokens {
    const payLoad = {
      email,
      isAdmin,
    };
    const accessToken = sign(payLoad, 'erer', {
      expiresIn: '5m',
    });
    const refreshToken = sign(payLoad, 'erer', {
      expiresIn: '15d',
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token: string): IUserPayload {
    const userData = verify(token, 'erer') as IUserPayload;
    return userData;
  }

  validateRefreshToken(token: string) {
    const userData = verify(token, 'erer') as IUserPayload;
    return userData;
  }

  async saveToken(userId: string, refreshToken: string) {
    const tokenData = await this.tokensModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await this.tokensModel.create({
      user: userId,
      refreshToken,
    });
    return token;
  }

  async removeToken(refreshToken: string) {
    const tokenData = await this.tokensModel.deleteOne({ refreshToken });
    return tokenData;
  }

  async findToken(refreshToken: string) {
    const tokenData = await this.tokensModel.findOne({ refreshToken });
    return tokenData;
  }
}
