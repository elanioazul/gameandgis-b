import { MinLength } from 'class-validator';

export class ResetPasswordDto {
  @MinLength(10)
  password: string;

  @MinLength(10)
  passwordConfirmation: string;
}
