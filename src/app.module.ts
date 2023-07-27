import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import config from './config/keys';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forRoot(config.mongoURI),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
