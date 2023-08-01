import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { sign, verify } from 'jsonwebtoken';
import { IUserPayload } from 'src/user/dto/user.dto';
import { IJwtTokens } from './dto/tokens.dto';
import { Tokens, TokensDocument } from './tokens.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(Tokens.name)
    private readonly tokensModel: Model<TokensDocument>,
    private readonly configService: ConfigService,
  ) {}

  generateTokens(
    email: string,
    _id: Types.ObjectId,
    isAdmin: boolean,
  ): IJwtTokens {
    const secret = this.configService.get('SECRET');
    console.log('secret=>', secret);
    const payLoad = {
      email,
      isAdmin,
      _id,
    };
    const accessToken = sign(payLoad, secret, {
      expiresIn: '5m',
    });
    const refreshToken = sign(payLoad, secret, {
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

  async saveToken(userId: Types.ObjectId, refreshToken: string) {
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
