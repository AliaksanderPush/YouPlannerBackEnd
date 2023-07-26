import { Injectable } from '@nestjs/common';
import { IJwtTokens } from 'src/tokens/dto/tokens.dto';
import { User, UserDocument } from 'src/user/user.schema';
import { hash, compare } from 'bcryptjs';
import { TokensService } from '../tokens/tokens.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly tokensService: TokensService,
  ) {}

  async registrationUser(
    param: User,
    password: string,
  ): Promise<User & IJwtTokens> {
    const { name, email } = param;

    const hashPass = await hash(password, 7);
    try {
      const user = await this.userModel.create({
        name,
        email,
        password: hashPass,
        avatar: '',
        isAdmin: false,
      });

      const tokens = this.tokensService.generateTokens(email, user.isAdmin);
      const result = { ...tokens, user };
      return result;
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
