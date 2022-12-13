import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImage } from './entities/product-image.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImagesRepository: Repository<ProductImage>
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productData } = createProductDto;

      const product = this.productsRepository.create({
        ...productData,
        images: images.map((image) => {
          return this.productImagesRepository.create({ url: image });
        })
      });

      await this.productsRepository.save(product);

      return { ...product, images };
    } catch (error) {
      this._handleDatabaseExecptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return await this.productsRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productsRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productsRepository.createQueryBuilder();
      product = await queryBuilder
        .where('title =:title or slug =:slug', { title: term, slug: term })
        .getOne();
    }

    if (!product) {
      throw new NotFoundException(`Product with ${term} not found.`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images = [], ...productData } = updateProductDto;

    const product = await this.productsRepository.preload({
      id,
      ...productData,
      images: images.map((image) => {
        return this.productImagesRepository.create({ url: image });
      })
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found.`);
    }

    try {
      await this.productsRepository.save(product);
    } catch (error) {
      this._handleDatabaseExecptions(error);
    }

    return { ...product, images };
  }

  async remove(id: string) {
    const product = await this.productsRepository.delete(id);

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found.`);
    }

    return product;
  }

  private _handleDatabaseExecptions(error: any) {
    this.logger.error(error);

    if (error.code === '23505') {
      throw new ConflictException('Product already exists');
    }

    throw new InternalServerErrorException(error);
  }
}
