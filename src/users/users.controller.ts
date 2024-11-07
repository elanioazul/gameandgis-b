import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ResetPasswordDto } from 'src/iam/authentication/dto/reset-password.dto/reset-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response, Request } from 'express';
import { UpdateAvatarDto } from 'src/avatars/dto/update-avatar.dto';
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

  //@Patch(':id/avatar')
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, callback) => {
          const customFileName = `${Date.now()}-${file.originalname}`;
          callback(null, customFileName);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    }),
  )
  async update(
    @Param('id') userId: string,
    @ActiveUser() user: ActiveUserData,
    @Body() updateAvatarDto: UpdateAvatarDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.usersService.updateUser(user.email, updateAvatarDto, file);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
