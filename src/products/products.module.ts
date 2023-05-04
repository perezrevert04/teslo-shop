import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ProductImage } from './entities/product-image.entity';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Product, ProductImage])],
  exports: [ProductsService],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
