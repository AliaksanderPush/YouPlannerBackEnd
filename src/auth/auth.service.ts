import { UserService } from './../user/user.service';
import { Injectable } from '@nestjs/common';
import { IJwtTokens } from 'src/tokens/dto/tokens.dto';
import { User, UserDocument } from 'src/user/user.schema';
import { hash, compare } from 'bcryptjs';
import { TokensService } from '../tokens/tokens.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDto } from 'src/user/dto/user.dto';
import { AuthLoginDto } from './dto/authLogin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly tokensService: TokensService,
    private readonly userService: UserService,
  ) {}

  async registration(param: UserDto): Promise<IJwtTokens> {
    const { name, email, password } = param;
    const hashPass = await hash(password, 7);
    const newUser = await this.userService.createUser(name, email, hashPass);

    const tokens = await this.tokensService.generateTokens(
      email,
      newUser._id,
      newUser.isAdmin,
    );
    await this.tokensService.saveToken(newUser._id, tokens.refreshToken);
    return { ...tokens };
  }

  async loginUser(authLoginDto: AuthLoginDto, user: User): Promise<IJwtTokens> {
    const { email } = authLoginDto;

    const tokens = await this.tokensService.generateTokens(
      email,
      user._id,
      user.isAdmin,
    );
    await this.tokensService.saveToken(user._id, tokens.refreshToken);
    return { ...tokens };
  }

  async comparePassword(pass: string, hash: string): Promise<boolean> {
    return await compare(pass, hash);
  }
}
