import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { TokensService } from 'src/tokens/tokens.service';
import { Tokens, TokensSchema } from 'src/tokens/tokens.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Tokens.name, schema: TokensSchema }]),
  ],
  providers: [UserService, TokensService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
