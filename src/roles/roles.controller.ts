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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BadRequest, InternalError } from 'src/shared/decorators';

@Controller('roles')
@ApiBearerAuth('jwt-auth') // Matches the name in .addBearerAuth()
@ApiTags('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // @Post()
  // create(@Body() createRoleDto: CreateRoleDto) {
  //   return this.rolesService.create(createRoleDto);
  // }

  // @Get()
  // findAll() {
  //   return this.rolesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.rolesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
  //   return this.rolesService.update(+id, updateRoleDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.rolesService.remove(+id);
  // }

  @Post('request-role')
  @ApiOperation({
    summary: 'User can request an rol upgrade',
    description: 'rol upgrade',
  })
  @ApiResponse({
    status: 200,
  })
  @InternalError('Internal Server Error', 'Internal Server Error Description')
  @BadRequest('Bad Request Working', 'Bad Request Description')
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
  @ApiOperation({
    summary: 'Admin user can accept a rol request',
    description: 'accept or reject a rol request',
  })
  @ApiResponse({
    status: 200,
  })
  @InternalError('Internal Server Error', 'Internal Server Error Description')
  @BadRequest('Bad Request Working', 'Bad Request Description')
  @Roles({ name: RolesEnum.ADMIN })
  async handleRoleRequest(
    @Param('id') requestId: number,
    @Body('approve') approve: boolean,
  ) {
    return this.rolesService.handleRoleRequest(requestId, approve);
  }
}
