import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/roles/entities/role.entity';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { BcryptService } from 'src/iam/hashing/bcrypt.service';
import { Avatar } from 'src/avatars/entities/avatar.entity';
import { AvatarsService } from 'src/avatars/avatars.service';
import { AvatarsModule } from 'src/avatars/avatars.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Avatar]), AvatarsModule],
  controllers: [UsersController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    UsersService,
    AvatarsService,
  ],
})
export class UsersModule {}
