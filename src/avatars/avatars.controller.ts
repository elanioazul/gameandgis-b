import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Req,
  UploadedFile,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AvatarsService } from './avatars.service';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateAvatarFileResponse } from './classes/creation-response';
import { Response, Request } from 'express';

@Controller('avatars')
export class AvatarsController {
  constructor(private readonly avatarsService: AvatarsService) {}

  // @Post()
  // create(@Body() createAvatarDto: CreateAvatarDto) {
  //   return this.avatarsService.create(createAvatarDto);
  // }

  // @Get()
  // findAll() {
  //   return this.avatarsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.avatarsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAvatarDto: UpdateAvatarDto) {
  //   return this.avatarsService.update(+id, updateAvatarDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.avatarsService.remove(+id);
  // }
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req: Request, file, callback) => {
          const generateCustomFilename = (file, label, isTheDefault) => {
            const getFirstChar = (word: string): string => {
              return word.substring(0, 1).toUpperCase();
            };
            const filenameWithoutExtension = file.originalname
              .split('.')
              .slice(0, -1)
              .join('.');
            return (
              `${Date.now()}` +
              '-' +
              getFirstChar(label) +
              `${filenameWithoutExtension}`
            );
          };
          const storageObj: CreateAvatarDto = req.body as CreateAvatarDto;
          const customFileName = generateCustomFilename(
            file,
            storageObj.label,
            storageObj.isTheDefault,
          );
          callback(null, customFileName);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 10, // Set a reasonable limit, for example, 10 MB
      },
    }),
  )
  async upload(
    @Body() storageObjDto: CreateAvatarDto,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const createdAvtarFile = await this.avatarsService.create(
        storageObjDto,
        file,
        storageObjDto.isTheDefault
      );

      return new CreateAvatarFileResponse(
        'Avatar created successfully',
        createdAvtarFile,
      );
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal Server Error uploading file',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
