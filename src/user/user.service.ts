import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TokensService } from 'src/tokens/tokens.service';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly tokensService: TokensService,
  ) {}

  async getUserById(id: string): Promise<User | null> {
    return await this.userModel.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email });
  }
}
