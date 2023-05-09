import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class Product {
  @ApiProperty({
    description: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Product title',
    example: 'Nike Air Max 90',
    uniqueItems: true
  })
  @Column('text', {
    unique: true
  })
  title: string;

  @ApiProperty({
    description: 'Product price',
    example: 100.0
  })
  @Column('float', {
    default: 0
  })
  price: number;

  @ApiProperty({
    description: 'Product description',
    example: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    default: null
  })
  @Column({
    type: 'text',
    nullable: true
  })
  description: string;

  @ApiProperty({
    description: 'Product slug - used for SEO',
    example: 'nike_air_max_90',
    uniqueItems: true
  })
  @Column({
    type: 'text',
    unique: true
  })
  slug: string;

  @ApiProperty({
    description: 'Product stock',
    example: 10
  })
  @Column({
    type: 'int',
    default: 0
  })
  stock: number;

  @ApiProperty({
    description: 'Product sizes',
    example: ['S', 'M', 'L', 'XL']
  })
  @Column({
    type: 'text',
    array: true,
    default: []
  })
  sizes: string[];

  @ApiProperty({
    description: 'Product gender',
    example: 'women'
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    description: 'Product tags',
    example: ['nike', 'air', 'max', '90']
  })
  @Column({
    type: 'text',
    array: true,
    default: []
  })
  tags: string[];

  @ApiProperty({
    description: 'Product images',
    example: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        url: 'https://example.com/image.jpg'
      }
    ]
  })
  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.products, { eager: true })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.images) {
      this.images = [];
    }

    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug.toLowerCase().replace(/ /g, '_');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug.toLowerCase().replace(/ /g, '_');
  }
}
