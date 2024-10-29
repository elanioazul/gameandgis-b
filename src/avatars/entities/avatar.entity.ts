import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Avatar {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalname: string;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @Column()
  isTheDefault: boolean;

  @OneToMany(() => User, (user) => user.avatar)
  users: User[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
  })
  createdTimeStampWithTimeZone: Date;
}
