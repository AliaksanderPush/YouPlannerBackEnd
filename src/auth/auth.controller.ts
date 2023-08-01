import { UserService } from './../user/user.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/user/dto/user.dto';
import { IJwtTokens } from 'src/tokens/dto/tokens.dto';
import { AuthLoginDto } from './dto/authLogin.dto';
import { errAuthMessage } from './auth.constants';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('/registration')
  @HttpCode(HttpStatus.CREATED)
  async registration(@Body() userDto: UserDto): Promise<IJwtTokens> {
    const user = await this.userService.getUserByEmail(userDto.email);
    if (user) {
      throw new HttpException(
        errAuthMessage.ALREDY_REGISTERED,
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.authService.createUser(userDto);
  }

  @UsePipes(new ValidationPipe())
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() authLoginDto: AuthLoginDto) {
    const user = await this.userService.getUserByEmail(authLoginDto.email);
    if (!user) {
      throw new HttpException(
        errAuthMessage.USER_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }
    const result = await this.authService.comparePassword(
      authLoginDto.password,
      user.password,
    );
    if (!result) {
      throw new HttpException(
        errAuthMessage.EMAIL_OR_PASSWORD_DO_NOT_MATCH,
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.authService.loginUser(authLoginDto, user);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout() {
    console.log('id=>');

    //return this.authService.logout(new Types.ObjectId(userId));
  }
}
