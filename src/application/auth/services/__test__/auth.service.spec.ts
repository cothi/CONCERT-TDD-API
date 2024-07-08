import { Test, TestingModule } from '@nestjs/testing';
import { IAuthRepository } from 'src/domain/auth/interfaces/repositories/auth-repository.interface';
import { RegisterUserModel } from 'src/domain/auth/model/register-user.model';
import { UserModel } from 'src/domain/auth/model/user.model';
import { AUTH_REPOSITORY } from 'src/domain/auth/symbol/auth-repository.symbol';
import { IAuthService } from '../../interfaces/auth-service.interface';
import { AUTH_SERVICE } from '../../symbol/auth-service.symbol';
import { AuthService } from '../auth.service';
import { LoginUserModel } from 'src/domain/auth/model/login-user.model';

describe('AuthService', () => {
  let authService: IAuthService;
  let mockAuthRepository: jest.Mocked<IAuthRepository>;

  beforeEach(async () => {
    mockAuthRepository = {
      registerUser: jest.fn(),
      findUserByEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AUTH_REPOSITORY,
          useValue: mockAuthRepository,
        },
        {
          provide: AUTH_SERVICE,
          useClass: AuthService,
        },
      ],
    }).compile();
    authService = module.get<IAuthService>(AUTH_SERVICE);
  });

  describe('registerUser', () => {
    it('유저가 성공적으로 생성되어야 합니다.', async () => {
      const registerUserModel = RegisterUserModel.create('test@test.ai');
      const expectedUserModel = UserModel.create('1', 'test@test.ai');
      mockAuthRepository.registerUser.mockResolvedValue(expectedUserModel);
      const result = await authService.registerUser(registerUserModel);
      expect(result).toEqual(expectedUserModel);
    });
  });

  describe('findUserByEmail', () => {
    it('유저가 성공적으로 조회되어야 합니다.', async () => {
      const loginUserModel = LoginUserModel.create('test@test.ai');
      const expectedUserModel = UserModel.create('1', 'test@test.ai');
      mockAuthRepository.findUserByEmail.mockResolvedValue(expectedUserModel);
      const result = await authService.findUserByEmail(loginUserModel);
      expect(result).toEqual(expectedUserModel);
    });
  });
});
