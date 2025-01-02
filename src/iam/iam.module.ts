import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { AccessTokenGuard } from './authentication/guards/access-token/access-token.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './authentication/guards/authentication/authentication.guard';
import { RedisModule } from 'src/infrastructure/redis/redis.module';
import { Role } from 'src/roles/entities/role.entity';
import { RolesGuard } from './authorization/guards/roles/roles.guard';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AvatarsService } from 'src/avatars/avatars.service';
import { AvatarsModule } from 'src/avatars/avatars.module';
import { Avatar } from 'src/avatars/entities/avatar.entity';
import { BrevoService } from 'src/providers/services/transactional-emails/brevo/brevo.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Avatar]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    RedisModule,
    UsersModule,
    AvatarsModule,
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AccessTokenGuard,
    AuthenticationService,
    UsersService,
    AvatarsService,
    BrevoService,
  ],
  controllers: [AuthenticationController],
})
export class IamModule {}
