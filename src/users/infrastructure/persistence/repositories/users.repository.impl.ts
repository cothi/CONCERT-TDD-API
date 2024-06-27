import { Repository } from 'typeorm';
import { UsersRepository } from '../../../domain/repositories/users.repository';
import { User } from '../../../domain/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../../../presentation/dto/request/create-user.request.dto';

export const UsersRepositorySymbol = Symbol('UsersRepository');

export class UsersRepositoryImpl implements UsersRepository {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createUser(data: CreateUserDto): Promise<User> {
    return await this.users.save(data);
    // return await this.users.save(data);
  }

  async getUser(email: string): Promise<User> {
    return await this.users.findOne({ where: { email: email } });
  }

  async getAllUsers(): Promise<User[]> {
    // 모든 유저를 가져온다.
    return await this.users.find();
  }
}
