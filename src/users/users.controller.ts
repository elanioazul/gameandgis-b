import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ResetPasswordDto } from 'src/iam/authentication/dto/reset-password.dto/reset-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //esto es llamado desde src\iam\authentication\authentication.service.ts
  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.createUser(createUserDto);
  // }

  @Post('reset-password')
  resetPassword(
    @ActiveUser() user: ActiveUserData,
    @Body() dto: ResetPasswordDto,
  ) {
    return this.usersService.resetPassowrd(user.email, dto);
  }

  @Put(':id/avatar/:avatarId')
  async updateUserAvatar(
    @ActiveUser() user: ActiveUserData,
    @Param('avatarId') avatarId: number,
  ) {
    return this.usersService.updateUserAvatar(user.email, avatarId);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
