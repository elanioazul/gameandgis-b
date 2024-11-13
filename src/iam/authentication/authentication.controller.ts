import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { AuthType } from './enums/auth-type.enum';
import { Auth } from './decorators/auth.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto/refresh-token.dto';
import { UsersService } from 'src/users/users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequest, InternalError } from 'src/shared/decorators';

@Auth(AuthType.None)
@Controller('authentication')
@ApiTags('authentication')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly userService: UsersService,
  ) {}

  @Post('sign-up')
  @ApiOperation({
    summary: 'Sign-up user and subsequently create a user',
    description: 'sign-up',
  })
  @ApiResponse({
    status: 200,
  })
  @InternalError('Internal Server Error', 'Internal Server Error Description')
  @BadRequest('Bad Request Working', 'Bad Request Description')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @HttpCode(HttpStatus.OK) // by default @Post does 201, 200 is more logical- hence using @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  @ApiOperation({
    summary: 'Sign-in user returning a jwt for resources access',
    description: 'sign-in',
  })
  @ApiResponse({
    status: 200,
  })
  @InternalError('Internal Server Error', 'Internal Server Error Description')
  @BadRequest('Bad Request Working', 'Bad Request Description')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  @ApiOperation({
    summary: 'Refresh jwt',
    description: 'refresh jwt',
  })
  @ApiResponse({
    status: 200,
  })
  @InternalError('Internal Server Error', 'Internal Server Error Description')
  @BadRequest('Bad Request Working', 'Bad Request Description')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }
}
