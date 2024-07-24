import { PointWalletRepository } from 'src/infrastructure/points/repository/point-wallet.repository';
import { PointWalletService } from '../point-wallet.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Decimal } from '@prisma/client/runtime/library';
import { UserPoint } from '@prisma/client';
import { ChargePointModel } from '../../model/point-wallet.model';

describe('PointWalletService', () => {
  let service: PointWalletService;
  let repository: jest.Mocked<PointWalletRepository>;

  beforeEach(async () => {
    const mockRepository = {
      chargePoints: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PointWalletService,
        {
          provide: PointWalletRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PointWalletService>(PointWalletService);
    repository = module.get(PointWalletRepository);
  });

  describe('chargePoints', () => {
    it('포인트 충전을 요청하면 포인트 충전을 수행한다.', async () => {
      const dto = new ChargePointModel();
      dto.amount = new Decimal(111);
      dto.userId = '1';

      const expectedResult: UserPoint = {
        id: '1',
        userId: '1',
        amount: new Decimal(111),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      repository.chargePoints.mockResolvedValue(expectedResult);
      const result = await service.chargePoints(dto);
      expect(result).toEqual(expectedResult);
    });
  });
});
