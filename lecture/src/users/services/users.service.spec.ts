import { Test, TestingModule } from '@nestjs/testing';
import { UsersServiceImpl, UsersServiceSymbol } from './users.service.impl';
import { UsersService } from './users.service';
import { UserOutputDto } from '../dto/create-user.dto';
import { UsersRepository } from '../repositories/users.repository';
import {
  UsersRepositoryImpl,
  UsersRepositorySymbol,
} from '../repositories/users.repository.impl';
import { User } from '../entities/user.entity';
import { create } from 'domain';

const mockUsersRepository = {
  createUser: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersServiceSymbol,
          useClass: UsersServiceImpl,
        },
        {
          provide: UsersRepositorySymbol,
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersServiceImpl>(UsersServiceSymbol);
    usersRepository = module.get(UsersRepositorySymbol);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('유저 생성', () => {
    it('유저를 생성하면 해당 유저를 반환한다', async () => {
      const user: User = {
        id: 'qwer',
        name: 'test',
        email: 'test1@gmail.ai',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      usersRepository.createUser.mockResolvedValue(user);

      const res: UserOutputDto = await service.createUser({
        name: user.name,
        email: user.email,
      });

      expect(res.ok).toEqual(true);
    });

    it('유저 생성시 올바른 양식이 아닐 경우 에러를 반환한다', async () => {
      const user = await service.createUser({
        name: undefined,
        email: undefined,
      });

      expect(user.ok).toEqual(false);
    });
  });
});
