import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TokensService } from 'src/tokens/tokens.service';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { errAuthMessage } from 'src/auth/auth.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly tokensService: TokensService,
  ) {}

  async getUserById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException(
        errAuthMessage.USER_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }
  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async updateCodeOfUserByEmail(email: string, code: number): Promise<void> {
    const upUser = await this.userModel.findOneAndUpdate(
      { email },
      { $set: { code } },
      { new: true },
    );
    console.log('upUser=>', upUser);
  }

  async createUser(
    name: string,
    email: string,
    hashPass: string,
  ): Promise<User> {
    const newUser = await this.userModel.create({
      name,
      email,
      password: hashPass,
      avatar: '',
      isAdmin: false,
    });
    return newUser;
  }
}
