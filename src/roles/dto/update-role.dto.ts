import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { IsValidRole } from '../decorators/validate-role.decorator';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
export class RequestRoleUpgradeDto {
  @IsValidRole({
    message: 'Role must be one of the following: admin, gestor, regular',
  })
  role: string;
}
