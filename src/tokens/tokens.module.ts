import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';

@Module({
  exports: [TokensService],
  providers: [TokensService],
})
export class TokensModule {}
