import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  BadRequestException,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateDto } from './dto/create.dto';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('test/:id')
  getHello(@Param('id', ParseIntPipe) id: number) {
    if (id < 1) {
      throw new BadRequestException([{ en: 'My Err', spa: 'Spanish' }]);
    }
    return id;
    //return this.appService.getHello();
  }

  @UsePipes(new ValidationPipe())
  @Post('create')
  create(@Body() dto: CreateDto) {
    console.log('Post');
  }
}
