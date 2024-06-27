import { Inject, Injectable } from '@nestjs/common';
import { UsersRepositorySymbol } from '../../infrastructure/persistence/repositories/users.repository.impl';
import { UsersService } from './user.service';
import { UsersRepository } from 'src/users/domain/repositories/users.repository';
import { CreateUserDto } from 'src/users/presentation/dto/request/create-user.request.dto';
import { UserResponseDto } from '../../presentation/dto/response/user.response.dto';

export const UsersServiceSymbol = Symbol('UsersService');

@Injectable()
export class UsersServiceImpl implements UsersService {
  constructor(
    @Inject(UsersRepositorySymbol)
    private readonly usersRepository: UsersRepository,
  ) {}
  async createUser(data: CreateUserDto): Promise<UserResponseDto> {
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
      users: user,
    };
  }
  async getUser(email: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.getUser(email);

    return {
      users: user,
      ok: true,
    };
  }
  async getAllUsers(): Promise<UserResponseDto> {
    const users = await this.usersRepository.getAllUsers();
    return {
      users: users,
      ok: true,
    };
  }
}
