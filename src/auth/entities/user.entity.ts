import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('text', { unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column('text')
  fullname: string;

  @Column('bool', { default: true })
  isActive: boolean;

  @Column({
    type: 'text',
    array: true,
    default: ['user']
  })
  roles: string[];
}
