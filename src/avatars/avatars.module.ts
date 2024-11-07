import { Module } from '@nestjs/common';
import { AvatarsService } from './avatars.service';
import { AvatarsController } from './avatars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Avatar } from './entities/avatar.entity';
import { AvatarSeeder } from './classes/avatarseeder';

@Module({
  imports: [TypeOrmModule.forFeature([User, Avatar])],
  controllers: [AvatarsController],
  providers: [AvatarsService, AvatarSeeder],
  exports: [AvatarsService],
})
export class AvatarsModule {}
