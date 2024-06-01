import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from 'src/iam/authentication/dto/sign-up.dto/sign-up.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}
  async createUser(signUpDto: SignUpDto): Promise<User> {
    const { email, password } = signUpDto;
    const user = this.userRepository.create({ email, password });

    const regularRole = await this.roleRepository.findOne({
      where: { name: 'regular' },
    });
    user.roles = [regularRole];

    return await this.userRepository.save(user);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
