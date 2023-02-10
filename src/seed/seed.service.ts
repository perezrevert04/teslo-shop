import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed.data';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async runSeed() {
    await this.insertNewProducts();
    return 'Seed executed successfully.';
  }

  private async insertNewProducts() {
    await this.productsService.deleteAllProducts();

    const insertPromises = initialData.products.map((product) =>
      this.productsService.create(product)
    );

    await Promise.all(insertPromises);

    return true;
  }
}
