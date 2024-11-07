import { Controller } from '@nestjs/common';
import { AvatarsService } from './avatars.service';

@Controller('avatars')
export class AvatarsController {
  constructor(private readonly avatarsService: AvatarsService) {}

  //AL FINAL ESTOY HACIENDO QUE EL AVATAR ENTRA POR EL @PUT DE USER
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
}
