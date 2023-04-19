import {
  BadRequestException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDBError(error);
    }
  }

  private handleDBError(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    throw new InternalServerErrorException('Internal Server Error');
  }
}
