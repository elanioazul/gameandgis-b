import { Injectable } from '@nestjs/common';
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
