import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Types } from 'mongoose';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile/:id')
  async getProfile(@Param('id') _id: Types.ObjectId) {
    return this.userService.getUserById(_id);
  }
}
