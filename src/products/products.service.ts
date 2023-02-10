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
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductImage } from './entities/product-image.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly dataSource: DataSource,
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
    const products = await this.productsRepository.find({
      take: limit,
      skip: offset,
      relations: { images: true }
    });

    return products.map((product) => ({
      ...product,
      images: product.images.map((image) => image.url)
    }));
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productsRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productsRepository.createQueryBuilder();
      product = await queryBuilder
        .where('title =:title or slug =:slug', { title: term, slug: term })
        .leftJoinAndSelect('prod.images', 'images')
        .getOne();
    }

    if (!product) {
      throw new NotFoundException(`Product with ${term} not found.`);
    }

    return product;
  }

  async findeOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);

    return {
      ...rest,
      images: images.map((image) => image.url)
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productsRepository.preload({
      id,
      ...toUpdate
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found.`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });

        product.images = images.map((image) => {
          return this.productImagesRepository.create({ url: image });
        });
      }

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();

      // await this.productsRepository.save(product);
      return this.findeOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this._handleDatabaseExecptions(error);
    } finally {
      await queryRunner.release();
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

  async deleteAllProducts() {
    const query = this.productsRepository.createQueryBuilder('product');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this._handleDatabaseExecptions(error);
    }
  }
}
