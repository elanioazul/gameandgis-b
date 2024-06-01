import { SetMetadata } from '@nestjs/common';
//import { Role } from 'src/roles/entities/role.entity';
import { RoleName } from '../types/role-name.type';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleName[]) => SetMetadata(ROLES_KEY, roles);
