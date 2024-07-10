import { PointWalletRepository } from 'src/infrastructure/database/repositories/points/point-wallet.repository';
import { PointWalletService } from '../point-wallet.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ChargePointDto } from '../../dto/charge-point.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { UserPoint } from '@prisma/client';

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
      const dto = ChargePointDto.create(new Decimal(111), '1');
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
