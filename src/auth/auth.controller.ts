import { UserService } from './../user/user.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/user/dto/user.dto';
import { IJwtTokens } from 'src/tokens/dto/tokens.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { errAuthMessage } from './auth.constants';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { GetCurrentUser } from 'src/common/decorators/get-current-user.decorator';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Types } from 'mongoose';

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
  @Post('/refresh')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(refreshToken);
  }

  // @Get('/google/login')
  // @UseGuards(GoogleAuthGuard)
  // async googleAuth(@Req() req) {}

  // @Get('/google/redirect')
  // @UseGuards(GoogleAuthGuard)
  // googleAuthRedirect(@Req() request: Request) {
  //   return this.authService.googleAuth(request.user);
  // }

  @Post('/update-password')
  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  async updatePassword(
    @Body() { email, password, confirmPassword }: UpdatePasswordDto,
  ) {
    if (password !== confirmPassword) {
      throw new HttpException(
        errAuthMessage.WRONG_PASSWORD,
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.authService.changeUserPassword(email, password);
  }
}
