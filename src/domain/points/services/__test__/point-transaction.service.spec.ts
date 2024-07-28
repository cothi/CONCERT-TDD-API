// src/domain/points/services/__tests__/point-transaction.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { PointTransactionService } from '../point-transaction.service';
import { PointTransactionRepository } from 'src/infrastructure/points/repository/point-payment.repository';
import {
  GetPaymentsByUserIdModel,
  PaymentModel,
  RecordPaymentModel,
} from '../../model/payment.model';
import { PaymentType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

describe('PointTransactionService', () => {
  let service: PointTransactionService;
  let repository: jest.Mocked<PointTransactionRepository>;

  beforeEach(async () => {
    const mockRepository = {
      getPointHistory: jest.fn(),
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPaymentHistory', () => {
    it('사용자 ID로 결제 내역을 조회해야 합니다', async () => {
      const mockModel: GetPaymentsByUserIdModel = { userId: 'user1' };
      const model = PaymentModel.create(
        new Decimal(100),
        '1',
        PaymentType.CHARGE,
        '1',
      );
      const mockResult = [model];
      repository.getPointHistory.mockResolvedValue(mockResult);

      const result = await service.getPaymentHistory(mockModel);

      expect(repository.getPointHistory).toHaveBeenCalledWith(
        mockModel,
        undefined,
      );
      expect(result).toEqual(mockResult);
    });

    it('트랜잭션 객체와 함께 결제 내역을 조회해야 합니다', async () => {
      const model = PaymentModel.create(
        new Decimal(100),
        '1',
        PaymentType.CHARGE,
        '1',
      );
      const mockResult = [model];
      const mockModel = GetPaymentsByUserIdModel.create('1');

      repository.getPointHistory.mockResolvedValue(mockResult);

      const result = await service.getPaymentHistory(mockModel);

      expect(result).toEqual(mockResult);
    });
  });

  describe('recordPaymentHistory', () => {
    it('새로운 결제 내역을 기록해야 합니다', async () => {
      const mockModel = RecordPaymentModel.create(
        new Decimal(100),
        '1',
        PaymentType.CHARGE,
      );
      const mockResult = PaymentModel.create(
        new Decimal(100),
        '1',
        PaymentType.CHARGE,
        '1',
      );

      repository.recordPointHistory.mockResolvedValue(mockResult);

      const result = await service.recordPaymentHistory(mockModel);

      expect(repository.recordPointHistory).toHaveBeenCalledWith(
        mockModel,
        undefined,
      );
      expect(result).toEqual(mockResult);
    });

    it('트랜잭션 객체와 함께 새로운 결제 내역을 기록해야 합니다', async () => {
      const mockModel = RecordPaymentModel.create(
        new Decimal(100),
        '1',
        PaymentType.TICKET_PURCHASE,
      );
      const mockResult = PaymentModel.create(
        new Decimal(100),
        '1',
        PaymentType.TICKET_PURCHASE,
        '1',
      );

      repository.recordPointHistory.mockResolvedValue(mockResult);

      const result = await service.recordPaymentHistory(mockModel);

      expect(result).toEqual(mockResult);
    });
  });
});
