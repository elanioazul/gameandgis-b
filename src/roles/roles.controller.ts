import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { RequestRoleUpgradeDto, UpdateRoleDto } from './dto/update-role.dto';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { RolesEnum } from './enums/roles.enum';
import { Roles } from 'src/iam/authorization/decorators/roles.decorator';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }

  @Post('request-role')
  async requestRoleUpgrade(
    @ActiveUser() user: ActiveUserData,
    @Body() requestRoleUpgradeDto: RequestRoleUpgradeDto,
  ) {
    return this.rolesService.requestRoleUpgrade(
      user.email,
      requestRoleUpgradeDto.role,
    );
  }

  @Patch('role-requests/:id')
  @Roles({ name: RolesEnum.ADMIN })
  async handleRoleRequest(
    @Param('id') requestId: number,
    @Body('approve') approve: boolean,
  ) {
    return this.rolesService.handleRoleRequest(requestId, approve);
  }
}
