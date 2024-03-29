import * as bcrypt from 'bcrypt';
import { Product } from 'src/products/entities/product.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', {
    select: false
  })
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

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
    this.password = bcrypt.hashSync(this.password, 10);
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
