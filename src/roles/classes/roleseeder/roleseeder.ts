import { OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { Repository } from 'typeorm';

export class Roleseeder implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    const roles = ['regular', 'gestor', 'admin'];
    for (const roleName of roles) {
      const role = await this.roleRepository.findOne({
        where: { name: roleName },
      });
      if (!role) {
        const newRole = this.roleRepository.create({ name: roleName });
        await this.roleRepository.save(newRole);
      }
    }
  }
}
