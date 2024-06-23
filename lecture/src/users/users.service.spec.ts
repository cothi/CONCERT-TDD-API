import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('유저 생성', () => {
    it('유저를 생성하면 해당 유저를 반환한다', async () => {
      const user = await service.createUser({
        name: 'test',
        email: 'test@gmail.ai',
      });

      expect(user.name === 'test');
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
