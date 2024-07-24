import { Test, TestingModule } from '@nestjs/testing';
import { TransactionRepository } from 'src/infrastructure/payment/transaction.repository';
import { PrismaTransaction } from 'src/infrastructure/prisma/types/prisma.types';

import { TransactionType } from '@prisma/client';
import { TransactionService } from '../transaction.service';
import {
  CreateTransactionModel,
  GetTransactionByUserIdModel,
  TransactionModel,
  UpdateTransactionStatusModel,
} from '../../model/transaction.model';
import { Decimal } from '@prisma/client/runtime/library';

describe('TransactionService', () => {
  let service: TransactionService;
  let repository: jest.Mocked<TransactionRepository>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findByUserId: jest.fn(),
      updateStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: TransactionRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repository = module.get(TransactionRepository);
  });

  it('트랜잭션을 생성해야 한다', async () => {
    const model = new CreateTransactionModel();
    model.userId = 'user1';
    model.amount = new Decimal(100);
    model.transactionType = TransactionType.PAYMENT;

    const expectedTransaction: TransactionModel = {
      transactionId: 'transaction1',
      userId: 'user1',
      amount: new Decimal(100),
      transactionType: TransactionType.PAYMENT,
    };

    repository.create.mockResolvedValue(expectedTransaction);

    const result = await service.createTransaction(model);

    expect(repository.create).toHaveBeenCalledWith(model, undefined);
    expect(result).toEqual(expectedTransaction);
  });

  it('사용자 ID로 트랜잭션을 조회해야 한다', async () => {
    const model = new GetTransactionByUserIdModel();
    model.userId = 'user1';

    const expectedTransactions: TransactionModel[] = [
      {
        transactionId: 'transaction1',
        userId: 'user1',
        amount: new Decimal(100),
        transactionType: TransactionType.PAYMENT,
      },
      {
        transactionId: 'transaction2',
        userId: 'user2',
        amount: new Decimal(100),
        transactionType: TransactionType.PAYMENT,
      },
    ];

    repository.findByUserId.mockResolvedValue(expectedTransactions);

    const result = await service.getTransactionsByUserId(model);

    expect(repository.findByUserId).toHaveBeenCalledWith(model, undefined);
    expect(result).toEqual(expectedTransactions);
  });

  it('트랜잭션 상태를 업데이트해야 한다', async () => {
    const model = new UpdateTransactionStatusModel();
    model.transactionId = 'transaction1';
    model.transactionType = TransactionType.PAYMENT;

    const expectedTransaction: TransactionModel = {
      transactionId: 'transaction2',
      userId: 'user2',
      amount: new Decimal(100),
      transactionType: TransactionType.PAYMENT,
    };

    repository.updateStatus.mockResolvedValue(expectedTransaction);

    const result = await service.updateTransactionStatus(model);

    expect(repository.updateStatus).toHaveBeenCalledWith(model, undefined);
    expect(result).toEqual(expectedTransaction);
  });

  it('트랜잭션 객체가 전달되었을 때 올바르게 처리해야 한다', async () => {
    const model = new CreateTransactionModel();
    model.userId = 'user1';
    model.amount = new Decimal(100);
    model.transactionType = TransactionType.PAYMENT;

    const mockTx = {} as PrismaTransaction;

    const expectedTransaction: TransactionModel = {
      transactionId: 'transaction2',
      userId: 'user2',
      amount: new Decimal(100),
      transactionType: TransactionType.PAYMENT,
    };

    repository.create.mockResolvedValue(expectedTransaction);

    const result = await service.createTransaction(model, mockTx);

    expect(repository.create).toHaveBeenCalledWith(model, mockTx);
    expect(result).toEqual(expectedTransaction);
  });
});
