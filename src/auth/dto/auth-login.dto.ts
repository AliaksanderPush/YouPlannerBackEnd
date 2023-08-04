import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';
import { CustomPasswordValidate } from 'src/user/dto/user.dto';

export class AuthLoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString({ message: 'Enter you password!' })
  @Validate(CustomPasswordValidate, {
    message:
      'The password must contain characters, including letters, numbers, special characters, no spaces!',
  })
  password: string;
}
