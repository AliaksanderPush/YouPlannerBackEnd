import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { Tokens, TokensSchema } from './tokens.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tokens.name, schema: TokensSchema }]),
  ],
  exports: [TokensService],
  providers: [TokensService],
})
export class TokensModule {}
