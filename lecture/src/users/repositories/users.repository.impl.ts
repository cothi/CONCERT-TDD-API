import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

export const UsersRepositorySymbol = Symbol('UsersRepository');

export class UsersRepositoryImpl implements UsersRepository {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createUser(data: CreateUserDto): Promise<User> {
    return await this.users.create(data);
    // return await this.users.save(data);
  }
}
