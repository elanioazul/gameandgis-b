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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BadRequest, InternalError } from 'src/shared/decorators';
@Controller('users')
@ApiBearerAuth('jwt-auth') // Matches the name in .addBearerAuth()
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //esto es llamado desde src\iam\authentication\authentication.service.ts
  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.createUser(createUserDto);
  // }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset/change password',
    description: 'reset/change password',
  })
  @ApiResponse({
    status: 200,
  })
  @InternalError('Internal Server Error', 'Internal Server Error Description')
  @BadRequest('Bad Request Working', 'Bad Request Description')
  resetPassword(
    @ActiveUser() user: ActiveUserData,
    @Body() dto: ResetPasswordDto,
  ) {
    return this.usersService.resetPassowrd(user.email, dto);
  }

  //@Patch(':id/avatar')
  @Put(':id')
  @ApiOperation({
    summary: 'Update user details, name, email, avatar..',
    description: 'update user details',
  })
  @ApiResponse({
    status: 200,
  })
  @InternalError('Internal Server Error', 'Internal Server Error Description')
  @BadRequest('Bad Request Working', 'Bad Request Description')
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
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.usersService.updateUser(user.email, updateUserDto, file);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'get all user',
  })
  @ApiResponse({
    status: 200,
  })
  @InternalError('Internal Server Error', 'Internal Server Error Description')
  @BadRequest('Bad Request Working', 'Bad Request Description')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user details',
    description: 'get user details',
  })
  @ApiResponse({
    status: 200,
  })
  @InternalError('Internal Server Error', 'Internal Server Error Description')
  @BadRequest('Bad Request Working', 'Bad Request Description')
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
