import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { ProductsService } from 'src/products/products.service';
import { Repository } from 'typeorm';
import { initialData } from './data/seed.data';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>
  ) {}

  async runSeed() {
    await this.deleteTables();
    const user = await this.insertUsers();
    await this.insertNewProducts(user);

    return 'Seed executed successfully.';
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();

    const queryBuilder = this.usersRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertUsers(): Promise<User> {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach((user) => {
      const newUser = this.usersRepository.create(user);
      users.push(newUser);
    });

    await this.usersRepository.save(users);

    return users[0];
  }

  private async insertNewProducts(user: User) {
    const insertPromises = initialData.products.map((product) =>
      this.productsService.create(product, user)
    );

    await Promise.all(insertPromises);

    return true;
  }
}
