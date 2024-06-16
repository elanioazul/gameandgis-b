// role-request.entity.ts
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class RoleRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.roleRequests)
  user: User;

  @Column()
  requestedRole: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'denied';
}
