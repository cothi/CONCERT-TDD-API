import { Test, TestingModule } from '@nestjs/testing';
import { Payment } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { PointTransactionRepository } from 'src/infrastructure/database/repositories/points/point-transaction.repository';
import { RecordPaymentDto } from '../../dto/record-payment.dto';
import { PaymentType } from '../../enums/payment-type.enum';
import { PointTransactionService } from '../point-transaction.service';

describe('PaymentHistoryService', () => {
  let service: PointTransactionService;
  let repository: jest.Mocked<PointTransactionRepository>;

  beforeEach(async () => {
    const mockRepository = {
      recordPointHistory: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PointTransactionService,
        {
          provide: PointTransactionRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();
    service = module.get<PointTransactionService>(PointTransactionService);
    repository = module.get(PointTransactionRepository);
  });
  describe('recordPaymentHistory', () => {
    it('포인트 관련 트랜잭션을 정상적으로 기록해야 한다', async () => {
      const dto = RecordPaymentDto.create(
        '1',
        PaymentType.CHARGE,
        new Decimal(111),
      );
      const expectedResult: Payment = {
        id: 'payment1',
        userId: '1',
        type: PaymentType.CHARGE,
        amount: new Decimal(111),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.recordPointHistory.mockResolvedValue(expectedResult);
      const result = await service.recordPaymentHistory(dto);
      expect(result).toEqual(expectedResult);
    });
  });
});
