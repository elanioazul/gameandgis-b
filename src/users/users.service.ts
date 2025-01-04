import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpDto } from 'src/iam/authentication/dto/sign-up.dto/sign-up.dto';
import { ResetPasswordDto } from 'src/iam/authentication/dto/reset-password.dto/reset-password.dto';
import { HashingService } from 'src/iam/hashing/hashing.service';
import { Avatar } from 'src/avatars/entities/avatar.entity';
import { BrevoService } from 'src/providers/services/transactional-emails/brevo/brevo.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Avatar)
    private readonly avatarRepository: Repository<Avatar>,
    private readonly hashingService: HashingService,
    private emailServie: BrevoService,
  ) {}
  async createUser(signUpDto: SignUpDto): Promise<User> {
    const { name, surnameOne, surnameTwo, email, password } = signUpDto;
    const user = this.userRepository.create({
      name,
      surnameOne,
      surnameTwo,
      email,
      password,
    });

    const regularRole = await this.roleRepository.findOne({
      where: { name: 'regular' },
    });
    user.roles = [regularRole];
    const defaultAvatar = await this.avatarRepository.findOne({
      where: [{ isTheDefault: true }, { isCustom: false }],
    });
    //user.avatar_id = defaultAvatar.id;
    user.avatar = defaultAvatar;

    this.notifyUser(user);

    return await this.userRepository.save(user);
  }

  private async notifyUser(user: User): Promise<void> {
    try {
      //send notification email
      const admin = await this.userRepository.findOne({
        where: { email: 'hugo2023dev@gmail.com' }, //habría que buscar tbn por user que tenga role=3(admin)
      });
      if (admin) {
        this.emailServie.notifyUserSignUpSucceded(user, admin);
      } else {
        console.log('no admin was found when notifying user signup process');
      }
    } catch (error) {}
  }

  // async updateUserNoCustomAvatar(
  //   email: string,
  //   avatarId: number,
  //   userId?: number,
  // ): Promise<User> {
  //   //const user = await this.userRepository.findOne(userId);
  //   const user = await this.userRepository.findOne({
  //     where: { email: email },
  //   });
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   const avatar = await this.avatarService.findOne(avatarId);
  //   if (!avatar) {
  //     throw new NotFoundException('Avatar not found');
  //   }

  //   user.avatar = avatar;
  //   return this.userRepository.save(user);
  // }

  async updateUser(
    userEmail: string,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: userEmail },
    });
    if (!user) throw new NotFoundException('User not found');

    let avatar: Avatar;

    if (file) {
      // Handle custom avatar upload
      const newAvatar = new Avatar();
      newAvatar.originalname = file.originalname;
      newAvatar.filename = file.filename;
      newAvatar.path = file.path;
      newAvatar.mimetype = file.mimetype;
      newAvatar.size = file.size;
      newAvatar.isTheDefault = false;
      newAvatar.isCustom = true;

      avatar = await this.avatarRepository.save(newAvatar);
      user.avatar = avatar;
    } else if (updateUserDto.avatarId) {
      // Handle selection from predefined avatars
      avatar = await this.avatarRepository.findOne({
        where: { id: updateUserDto.avatarId },
      });
      if (!avatar) throw new NotFoundException('Avatar not found');
      user.avatar = avatar;
    }

    if (updateUserDto.email) {
      user.email = updateUserDto.email;
    }
    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }
    if (updateUserDto.surnameOne) {
      user.surnameOne = updateUserDto.surnameOne;
    }
    if (updateUserDto.surnameTwo) {
      user.surnameTwo = updateUserDto.surnameTwo;
    }

    // Save the user and reload it with the avatar relation
    await this.userRepository.save(user);
    return this.userRepository.findOne({
      where: { id: user.id },
      relations: ['avatar'],
    });
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

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({
      relations: ['avatar'],
    });
    return users;
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['avatar'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    //no muestro password
    user.password = undefined;
    // filter avatar properties
    if (user.avatar) {
      user.avatar = {
        id: user.avatar.id,
        originalname: user.avatar.originalname,
        filename: user.avatar.filename,
        path: user.avatar.path,
        mimetype: undefined,
        size: undefined,
        isCustom: undefined,
        isTheDefault: undefined,
        users: undefined,
        createdTimeStampWithTimeZone: undefined
      };
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
