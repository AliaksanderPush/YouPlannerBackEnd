import { UserService } from './../user/user.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IJwtTokens } from 'src/tokens/dto/tokens.dto';
import { User, UserDocument } from 'src/user/user.schema';
import { hash, compare } from 'bcryptjs';
import { TokensService } from '../tokens/tokens.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDto } from 'src/user/dto/user.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { EmailService } from 'src/email/email.service';
import { errAuthMessage } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly tokensService: TokensService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  async registration(param: UserDto): Promise<IJwtTokens> {
    const { name, email, password } = param;
    const hashPass = await this.hashdata(password);
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

  async logoutUser(refreshToken: string) {
    const deleted = await this.tokensService.removeToken(refreshToken);
    if (!deleted) {
      throw new HttpException(
        errAuthMessage.REFRESHTOKEN_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }
    return deleted;
  }

  async refreshTokens(refreshToken: string): Promise<IJwtTokens> {
    const userData = await this.tokensService.validateTokens(refreshToken);
    const token = await this.tokensService.findToken(refreshToken);
    if (!userData || !token) {
      throw new HttpException(errAuthMessage.TOKEN_FAULT, HttpStatus.FORBIDDEN);
    }
    const { email, _id, isAdmin } = userData;
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new HttpException(
        errAuthMessage.USER_NOT_FOUND,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const tokens = await this.tokensService.generateTokens(email, _id, isAdmin);
    await this.tokensService.saveToken(user._id, tokens.refreshToken);
    return { ...tokens };
  }

  async googleAuth(userInfo: User) {
    const { email, _id, isAdmin } = userInfo;
    const user = await this.userService.getUserByEmail(email);
    if (user) {
      const tokens = await this.tokensService.generateTokens(
        _id,
        email,
        isAdmin,
      );
      await this.tokensService.saveToken(_id, tokens.refreshToken);
      return tokens;
    }

    return this.registration(userInfo);
  }

  async changeUserPassword(email: string, password: string) {
    const user = this.userService.getUserByEmail(email);
    if (!user) {
      throw new HttpException(
        errAuthMessage.USER_NOT_FOUND,
        HttpStatus.UNAUTHORIZED,
      );
    }
    const hashPass = await this.hashdata(password);
    return await this.userModel.updateOne({ email }, { password: hashPass });
  }

  async sendToEmailWithCode(email: string): Promise<number> {
    const code = this.generateSixRandomNumber();
    await this.emailService.sendUserCode(email, code);
    return code;
  }

  async comparePassword(pass: string, hash: string): Promise<boolean> {
    const result = await compare(pass, hash);
    if (!result) {
      throw new HttpException(
        errAuthMessage.WRONG_PASSWORD,
        HttpStatus.BAD_REQUEST,
      );
    }
    return result;
  }

  private generateSixRandomNumber() {
    return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  }

  private async hashdata(data: string) {
    return await hash(data, 7);
  }
}
