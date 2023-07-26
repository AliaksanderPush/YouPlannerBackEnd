import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile/:id')
  async getProfile(@Param('id') id: string) {
    return this.userService.getUserProfileById(id);
  }
}
