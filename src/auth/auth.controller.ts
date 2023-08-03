import { UserService } from './../user/user.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/user/dto/user.dto';
import { IJwtTokens } from 'src/tokens/dto/tokens.dto';
import { AuthLoginDto } from './dto/authLogin.dto';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
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
    return this.authService.registration(userDto);
  }

  @UsePipes(new ValidationPipe())
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() authLoginDto: AuthLoginDto) {
    const user = await this.userService.getUserByEmail(authLoginDto.email);

    await this.authService.comparePassword(
      authLoginDto.password,
      user.password,
    );

    return this.authService.loginUser(authLoginDto, user);
  }

  @Post('/verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(@Body() { email }: { email: string }) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new HttpException(
        errAuthMessage.USER_NOT_FOUND,
        HttpStatus.BAD_REQUEST,
      );
    }
    console.log('User=>', user);
    const code = await this.authService.sendToEmailWithCode(email);
    console.log('code=>', code);
    await this.userService.updateCodeOfUserByEmail(email, code);
    return { status: HttpStatus.OK };
  }

  @Post('/logout')
  @UseGuards(AccessTokenGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() { refreshToken }: { refreshToken: string }) {
    return await this.authService.logoutUser(refreshToken);
  }

  // @Post('/refresh')
  // @HttpCode(HttpStatus.OK)
  // async refresh()
}
