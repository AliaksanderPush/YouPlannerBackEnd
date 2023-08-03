import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IUserPayload } from 'src/user/dto/user.dto';
import { IJwtTokens } from './dto/tokens.dto';
import { Tokens, TokensDocument } from './tokens.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(Tokens.name)
    private readonly tokensModel: Model<TokensDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async generateTokens(
    email: string,
    _id: Types.ObjectId,
    isAdmin: boolean,
  ): Promise<IJwtTokens> {
    const payLoad = {
      email,
      isAdmin,
      _id,
    };
    const accessToken = await this.jwtService.signAsync(payLoad, {
      secret: 'erer',
      expiresIn: '5m',
    });
    console.log('refresh=>', accessToken);
    const refreshToken = await this.jwtService.signAsync(payLoad, {
      secret: 'erer',
      expiresIn: '15d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateAccessToken(token: string): Promise<IUserPayload> {
    const userData = await this.jwtService.verifyAsync(token);
    return userData;
  }

  async validateRefreshToken(token: string) {
    const userData = await this.jwtService.verifyAsync(token);
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
