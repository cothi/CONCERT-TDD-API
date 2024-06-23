import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto, UserOutputDto } from '../dto/create-user.dto';
import { UsersService } from './users.service';
import { UsersRepository } from '../repositories/users.repository';
import { UsersRepositorySymbol } from '../repositories/users.repository.impl';

export const UsersServiceSymbol = Symbol('UsersService');

@Injectable()
export class UsersServiceImpl implements UsersService {
  constructor(
    @Inject(UsersRepositorySymbol)
    private readonly usersRepository: UsersRepository,
  ) {}
  async createUser(data: CreateUserDto): Promise<UserOutputDto> {
    if (!data.name) {
      return {
        ok: false,
        message: '이름을 입력해주세요',
      };
    }
    if (!data.email) {
      return {
        ok: false,
        message: '이메일을 입력해주세요',
      };
    }

    const user = await this.usersRepository.createUser(data);
    return {
      ok: true,
      user: user,
    };
  }
  async getUser(email: string): Promise<UserOutputDto> {
    const user = await this.usersRepository.getUser(email);

    return {
      user: user,
      ok: true,
    };
  }
  async getAllUsers(): Promise<UserOutputDto> {
    const users = await this.usersRepository.getAllUsers();
    return {
      users: users,
      ok: true,
    }
    
  }
}
