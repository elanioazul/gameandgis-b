import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class SignInDto {
  @ApiProperty({
    description: 'The first name of a user',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The email of a user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of a the user',
    minLength: 10,
  })
  @MinLength(10)
  password: string;
}
