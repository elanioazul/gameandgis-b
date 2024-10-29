import { Injectable } from '@nestjs/common';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { Repository } from 'typeorm';
import { UpdateAvatarDto } from './dto/update-avatar.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Avatar } from './entities/avatar.entity';

@Injectable()
export class AvatarsService {
  constructor(
    @InjectRepository(Avatar)
    private readonly avatarRepository: Repository<Avatar>,
  ) {}
  async create(
    avatarFiletDto: CreateAvatarDto,
    multerFile: Express.Multer.File,
    isTheDefault: boolean,
  ) {
    const {
      originalname,
      encoding,
      mimetype,
      destination,
      filename,
      path,
      size,
    } = multerFile;

    const file = this.avatarRepository.create({
      originalname,
      filename,
      path,
      mimetype,
      size,
      isTheDefault,
    });
    return this.avatarRepository.save(file);
  }

  async getDefaultAvatar(): Promise<Avatar> {
    // Assuming the default avatar is known and can be retrieved by specific criteria
    return this.avatarRepository.findOne({ where: { isTheDefault: true } });
  }

  findAll() {
    return `This action returns all avatars`;
  }

  async findOne(id: number) {
    return this.avatarRepository.findOne({ where: { id: id } });
  }

  update(id: number, updateAvatarDto: UpdateAvatarDto) {
    return `This action updates a #${id} avatar`;
  }

  remove(id: number) {
    return `This action removes a #${id} avatar`;
  }
}
