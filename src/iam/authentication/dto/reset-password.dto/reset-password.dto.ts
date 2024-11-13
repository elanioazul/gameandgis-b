import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'new password',
  })
  @MinLength(10)
  password: string;

  @ApiProperty({
    description: 'new password repited',
  })
  @MinLength(10)
  passwordConfirmation: string;
}
