import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class CustomPasswordValidate implements ValidatorConstraintInterface {
  validate(text: string) {
    return !text.match(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^_&.*-]).{1,}$/,
    );
  }

  defaultMessage() {
    return 'The password must contain characters, including letters, numbers, special characters, no spaces!';
  }
}

export class UserDto {
  @MinLength(2, { message: 'Login must be at least 2 characters!' })
  @MaxLength(20, { message: 'Login must be less than 20 characters long!' })
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email is failed!' })
  @IsString()
  email: string;

  @IsString({ message: 'Enter you password!' })
  @Validate(CustomPasswordValidate, {
    message:
      'The password must contain characters, including letters, numbers, special characters, no spaces!',
  })
  password: string;
  @IsString({ message: 'Please confirm password!' })
  @Validate(CustomPasswordValidate, {
    message:
      'The password must contain characters, including letters, numbers, special characters, no spaces!',
  })
  confirmPassword: string;
}

export interface IUserPayload {
  _id: string;
  email: string;
  isAdmin: boolean;
  iat?: number;
  exp?: number;
}
