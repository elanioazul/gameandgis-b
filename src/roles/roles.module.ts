import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Roleseeder } from './classes/roleseeder/roleseeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { RoleRequest } from './entities/role-request.entity';
import { BrevoService } from 'src/providers/services/transactional-emails/brevo/brevo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User, RoleRequest])],
  controllers: [RolesController],
  providers: [RolesService, Roleseeder, BrevoService],
})
export class RolesModule {}
