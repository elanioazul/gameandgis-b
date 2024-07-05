import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from 'src/iam/authentication/dto/sign-up.dto/sign-up.dto';
import { ResetPasswordDto } from 'src/iam/authentication/dto/reset-password.dto/reset-password.dto';
import { HashingService } from 'src/iam/hashing/hashing.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly hashingService: HashingService,
  ) {}
  async createUser(signUpDto: SignUpDto): Promise<User> {
    const { name, email, password } = signUpDto;
    const user = this.userRepository.create({ name, email, password });

    const regularRole = await this.roleRepository.findOne({
      where: { name: 'regular' },
    });
    user.roles = [regularRole];

    return await this.userRepository.save(user);
  }

  async resetPassowrd(email: string, resetPassDto: ResetPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    // const isEqual = await this.hashingService.compare(
    //   resetPassDto.password,
    //   resetPassDto.passwordConfirmation,
    // );
    if (resetPassDto.password !== resetPassDto.passwordConfirmation) {
      throw new UnauthorizedException('Password does not match');
    }
    user.password = await this.hashingService.hash(resetPassDto.password);
    await this.userRepository.save(user);
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
