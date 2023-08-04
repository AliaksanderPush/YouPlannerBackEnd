import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';
import { CustomPasswordValidate } from 'src/user/dto/user.dto';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString({ message: 'Enter you password!' })
  @Validate(CustomPasswordValidate, {
    message:
      'The password must contain characters, including letters, numbers, special characters, no spaces!',
  })
  password: string;

  @IsNotEmpty()
  confirmPassword: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
