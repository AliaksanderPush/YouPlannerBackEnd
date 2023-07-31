import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { Tokens, TokensSchema } from './tokens.schema';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJwtConfig } from 'src/config/jwt.config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tokens.name, schema: TokensSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
  ],
  exports: [TokensService],
  providers: [TokensService],
})
export class TokensModule {}
