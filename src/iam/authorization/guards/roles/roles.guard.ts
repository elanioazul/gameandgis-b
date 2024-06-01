import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { REQUEST_USER_KEY } from 'src/iam/consts/iam.consts';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
//import { Role } from 'src/roles/entities/role.entity';
import { RoleName } from '../../types/role-name.type';
import { ROLES_KEY } from '../../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const contextRoles = this.reflector.getAllAndOverride<RoleName[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!contextRoles) {
      return true;
    }
    const user: ActiveUserData = context.switchToHttp().getRequest()[
      REQUEST_USER_KEY
    ];
    if (!user || !user.roles) {
      return false;
    }

    // Check if any of the user's roles match the required roles
    return contextRoles.some((role) => user.roles.includes(role.name));
  }
}
