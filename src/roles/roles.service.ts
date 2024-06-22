import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleRequest } from './entities/role-request.entity';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { BrevoService } from 'src/providers/services/transactional-emails/brevo/brevo.service';
@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleRequest)
    private readonly roleRequestRepository: Repository<RoleRequest>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private emailServie: BrevoService,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    return 'This action adds a new role';
  }

  findAll() {
    return `This action returns all roles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }

  async requestRoleUpgrade(
    userEmail: string,
    requestedRole: string,
  ): Promise<RoleRequest> {
    const user = await this.userRepository.findOne({
      where: { email: userEmail },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const roleRequest = this.roleRequestRepository.create({
      user,
      requestedRole,
      status: 'pending',
    });

    const admin = await this.userRepository.findOne({
      where: { email: 'hugo2023dev@gmail.com' }, //habría que buscar tbn por user que tenga role=3(admin)
    });
    if (admin) {
      this.emailServie.notifyAdminNewRoleRequest(admin);
    } else {
      console.log('no admin was found');
    }
    this.emailServie.notifyUserRequestIsPending(user, admin);

    return await this.roleRequestRepository.save(roleRequest);
  }

  async handleRoleRequest(
    requestId: number,
    approve: boolean,
  ): Promise<RoleRequest> {
    const roleRequest = await this.roleRequestRepository.findOne({
      where: { id: requestId },
      relations: ['user', 'user.roles'],
    });
    if (!roleRequest) {
      throw new NotFoundException('Role request not found');
    }
    //console.log(roleRequest);
    roleRequest.status = approve ? 'approved' : 'denied';
    if (approve) {
      const role = await this.roleRepository.findOne({
        where: { name: roleRequest.requestedRole },
      });
      if (role) {
        //console.log('Role found:', role);

        // Ensure user.roles is initialized,
        //altough users are supposed to come with at least default role ('regular')
        if (!roleRequest.user.roles) {
          roleRequest.user.roles = [];
        }

        // console.log(
        //   'User roles before adding new role:',
        //   roleRequest.user.roles,
        // );

        // Add role to user's roles if it is not already present
        if (!roleRequest.user.roles.some((r) => r.id === role.id)) {
          roleRequest.user.roles.push(role);
          // console.log(
          //   'User roles after adding new role:',
          //   roleRequest.user.roles,
          // );

          await this.roleRequestRepository.manager.save(roleRequest.user);

          //send notification email
          const admin = await this.userRepository.findOne({
            where: { email: 'hugo2023dev@gmail.com' }, //habría que buscar tbn por user que tenga role=3(admin)
          });
          if (admin) {
            this.emailServie.notifyUserRequestIsApproved(
              roleRequest.user,
              admin,
            );
          } else {
            console.log('no admin was found');
          }
        } else {
          console.log('Role already exists in user roles');
        }
      } else {
        throw new NotFoundException(
          `Role ${roleRequest.requestedRole} not found`,
        );
      }
    }

    return await this.roleRequestRepository.save(roleRequest);
  }
}
