import { Avatar } from 'src/avatars/entities/avatar.entity';
import { RoleRequest } from 'src/roles/entities/role-request.entity';
import { Role } from 'src/roles/entities/role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];

  @OneToMany(() => RoleRequest, (roleRequest) => roleRequest.user)
  roleRequests: RoleRequest[];

  @ManyToOne(() => Avatar, (avatar) => avatar.users)
  @JoinColumn({ name: 'avatar_id' })
  avatar: Avatar;

  // @Column({ nullable: true })
  // avatar_id: number;
}
