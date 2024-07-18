import { Test, TestingModule } from '@nestjs/testing';
import { TransactionRepository } from 'src/infrastructure/database/repositories/payment/payment.repository';
import { TransactionService } from '../transaction.service';
import {
  CreateTransactionModel,
  UpdateTransactionStatusModel,
} from '../../model/transaction.model';
import { Decimal } from '@prisma/client/runtime/library';
import { TransactionType } from '@prisma/client';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let transactionRepository: jest.Mocked<TransactionRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: TransactionRepository,
          useFactory: () => ({
            create: jest.fn(),
            findByUserId: jest.fn(),
            updateStatus: jest.fn(),
          }),
        },
      ],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
    transactionRepository = module.get(TransactionRepository);
  });

  describe('createTransaction', () => {
    it('새로운 거래를 성공적으로 생성해야 한다', async () => {
      // given
      const createTransactionModel: CreateTransactionModel = {
        userId: 'user1',
        amount: new Decimal(1000),
        transactionType: 'PAYMENT',
      };
      const mockTransaction = {
        id: 'transaction1',
        ...createTransactionModel,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      transactionRepository.create.mockResolvedValue(mockTransaction);

      // when
      const result = await transactionService.createTransaction(
        createTransactionModel,
      );

      // then
      expect(result).toEqual(mockTransaction);
      expect(transactionRepository.create).toHaveBeenCalledWith(
        createTransactionModel,
        undefined,
      );
    });
  });

  describe('getTransactionsByUserId', () => {
    it('사용자 ID에 해당하는 모든 거래를 조회해야 한다', async () => {
      // given
      const userId = 'user1';
      const mockTransactions = [
        {
          id: 'transaction1',
          userId,
          amount: new Decimal(1000),
          transactionType: TransactionType.REFUND,
          status: 'COMPLETED',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'transaction2',
          userId,
          amount: new Decimal(2000),
          transactionType: TransactionType.PAYMENT,
          status: 'PENDING',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      transactionRepository.findByUserId.mockResolvedValue(mockTransactions);

      // when
      const result = await transactionService.getTransactionsByUserId(userId);

      // then
      expect(result).toEqual(mockTransactions);
      expect(transactionRepository.findByUserId).toHaveBeenCalledWith(userId);
    });

    it('사용자의 거래가 없을 경우 빈 배열을 반환해야 한다', async () => {
      // given
      const userId = 'user2';
      transactionRepository.findByUserId.mockResolvedValue([]);

      // when
      const result = await transactionService.getTransactionsByUserId(userId);

      // then
      expect(result).toEqual([]);
      expect(transactionRepository.findByUserId).toHaveBeenCalledWith(userId);
    });
  });

  describe('updateTransactionStatus', () => {
    it('거래 상태를 성공적으로 업데이트해야 한다', async () => {
      // given
      const updateModel: UpdateTransactionStatusModel = {
        transactionId: 'transaction1',
        transactionType: TransactionType.PAYMENT,
      };
      const mockUpdatedTransaction = {
        id: 'transaction1',
        userId: 'user1',
        amount: new Decimal(1000),
        transactionType: TransactionType.PAYMENT,
        status: 'COMPLETED',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      transactionRepository.updateStatus.mockResolvedValue(
        mockUpdatedTransaction,
      );

      // when
      const result =
        await transactionService.updateTransactionStatus(updateModel);

      // then
      expect(result).toEqual(mockUpdatedTransaction);
      expect(transactionRepository.updateStatus).toHaveBeenCalledWith(
        updateModel,
        undefined,
      );
    });
  });
});
