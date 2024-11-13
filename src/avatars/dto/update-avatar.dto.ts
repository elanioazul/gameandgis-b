import { Multer } from 'multer';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateAvatarDto {
  // @IsOptional()
  // @IsNumber()
  // avatarId?: number; // For selecting a predefined avatar (marieta)

  // @IsOptional()
  // file?: Multer['single']; // For custom uploaded by the user
}
