import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { HashingService } from '../hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';
import { EnumPgErrorCodes } from 'src/shared/enums/postgres-violations.enum';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto/refresh-token.dto';
import { RedisRepository } from 'src/infrastructure/redis/repository/redis.repository';
import { randomUUID } from 'crypto';
import { RefreshTokenPayload } from '../interfaces/refresh-token-payload.interface';
import { InvalidatedRefreshTokenError } from '../models/refresh-token.error';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(RedisRepository) private readonly redisRepository: RedisRepository,
    private readonly userService: UsersService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    try {
      const user = new User();
      user.name = signUpDto.name;
      user.email = signUpDto.email;
      user.surnameOne = signUpDto.surnameOne;
      user.surnameTwo = signUpDto.surnameTwo;
      user.password = await this.hashingService.hash(signUpDto.password);

      await this.userService.createUser(user);
      //await this.usersRepository.save(user);
    } catch (err) {
      const pgUniqueViolationErrorCode = EnumPgErrorCodes.unique_violation;
      if (err.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw err;
    }
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.usersRepository.findOne({
      where: { email: signInDto.email },
      relations: ['roles'], // Ensure roles are included
    });
    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }
    const isEqual = await this.hashingService.compare(
      signInDto.password,
      user.password,
    );
    if (!isEqual) {
      throw new UnauthorizedException('Password does not match');
    }
    return await this.generateTokens(user);
  }

  async generateTokens(user: User) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(user.id, this.jwtConfiguration.accessTokenTtl, {
        email: user.email,
        roles: user.roles?.map((role) => role.name) ?? [], // nullish coalescing
      }),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);
    await this.redisRepository.insert(user.id, refreshTokenId);
    return {
      tokenType: 'Bearer',
      accessToken,
      refreshToken,
      userDetails: {
        name: user.name,
        surnameOne: user.surnameOne,
        surnameTwo: user.surnameTwo,
        email: user.email,
      },
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      const user = await this.usersRepository.findOneByOrFail({
        id: sub,
      });
      const isValid = await this.redisRepository.validate(
        user.id,
        refreshTokenId,
      );
      if (isValid) {
        await this.redisRepository.invalidate(user.id);
      } else {
        throw new Error('Refresh token is invalid');
      }
      return this.generateTokens(user);
    } catch (err) {
      if (err instanceof InvalidatedRefreshTokenError) {
        // Take action: notify user that his refresh token might have been stolen?
        throw new UnauthorizedException('Access denied');
      }
      throw new UnauthorizedException();
    }
  }

  private async signToken(
    userId: number,
    expiresIn: number,
    payload?: Partial<ActiveUserData> | RefreshTokenPayload,
  ) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
