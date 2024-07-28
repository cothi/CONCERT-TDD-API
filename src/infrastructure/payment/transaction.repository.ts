import { Injectable } from '@nestjs/common';
import {
  CreateTransactionModel,
  GetTransactionByIdModel,
  GetTransactionByUserIdModel,
  TransactionModel,
} from 'src/domain/payment/model/transaction.model';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { UpdateTransactionStatusModel } from '../../domain/payment/model/transaction.model';
import { PrismaTransaction } from '../database/prisma/types/prisma.types';
import { TransactionMapper } from './mapper/transaction.mapper';

@Injectable()
export class TransactionRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    model: CreateTransactionModel,
    tx?: PrismaTransaction,
  ): Promise<TransactionModel> {
    const entity = TransactionMapper.toMapCreateTransactionEntity(model);
    const transaction = await (tx ?? this.prisma).transaction.create({
      data: {
        userId: entity.userId,
        amount: entity.amount,
        transactionType: entity.transactionType,
      },
    });
    return TransactionMapper.toMapTransactionModel(transaction);
  }
  async findById(
    model: GetTransactionByIdModel,
    tx?: PrismaTransaction,
  ): Promise<TransactionModel | null> {
    const entity = TransactionMapper.toMapGetTransactionByIdEntity(model);
    const transaction = await (tx ?? this.prisma).transaction.findUnique({
      where: { id: entity.id },
    });
    return TransactionMapper.toMapTransactionModel(transaction);
  }

  async findByUserId(
    model: GetTransactionByUserIdModel,
    tx?: PrismaTransaction,
  ): Promise<TransactionModel[]> {
    const entity = TransactionMapper.toMapGetTransactionByUserIdEntity(model);
    const transactions = await (tx ?? this.prisma).transaction.findMany({
      where: { userId: entity.userId },
      orderBy: { createdAt: 'desc' },
    });
    return TransactionMapper.toMapTransactionModels(transactions);
  }

  async updateStatus(
    model: UpdateTransactionStatusModel,
    tx?: PrismaTransaction,
  ): Promise<TransactionModel> {
    const entity = TransactionMapper.toMapUpdateTransactionEntity(model);
    const transaction = await (tx ?? this.prisma).transaction.update({
      where: { id: entity.id },
      data: { transactionType: entity.transactionType },
    });
    return TransactionMapper.toMapTransactionModel(transaction);
  }
}
