import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Avatar } from '../entities/avatar.entity';

@Injectable()
export class AvatarSeeder implements OnModuleInit {
  constructor(
    @InjectRepository(Avatar)
    private readonly avatarRepository: Repository<Avatar>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    const defaultAvatarPath = path.resolve(
      __dirname,
      '..',
      '..',
      'assets',
      'avatars',
      'default_avatar.png',
    );

    // console.log('Current __dirname:', __dirname);

    // console.log('Resolved path:', defaultAvatarPath);

    // Check if the file exists at the resolved path
    if (!fs.existsSync(defaultAvatarPath)) {
      console.error(`File not found at: ${defaultAvatarPath}`);
      return;
    }

    const avatarExists = await this.avatarRepository.findOne({
      where: { isTheDefault: true },
    });

    if (!avatarExists) {
      const stats = fs.statSync(defaultAvatarPath);

      const newAvatar = this.avatarRepository.create({
        originalname: 'default_avatar.png',
        filename: 'default_avatar.png',
        path: defaultAvatarPath,
        mimetype: 'image/png',
        size: stats.size,
        isTheDefault: true,
        isCustom: false, //no es de los que me va a hacer marieta
      });

      await this.avatarRepository.save(newAvatar);
    }
  }
}
