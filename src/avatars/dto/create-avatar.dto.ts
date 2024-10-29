import { IsString, IsBoolean } from 'class-validator';
import { Multer } from 'multer';
export class CreateAvatarDto {
  @IsString()
  label: string;

  @IsBoolean()
  isTheDefault: boolean;

  file?: Multer['single'];
}
