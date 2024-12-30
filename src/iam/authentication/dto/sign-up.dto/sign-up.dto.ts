import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class SignUpDto {
  @ApiProperty({
    description: 'The first name of a user',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The first surname of a user',
  })
  @IsString()
  surnameOne: string;

  @ApiProperty({
    description: 'The second name of a user',
  })
  @IsString()
  surnameTwo: string;

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

  //avatarId?: number;
}
