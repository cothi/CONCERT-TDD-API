import { Injectable } from '@nestjs/common';
import { Prisma, Transaction } from '@prisma/client';
import { CreateTransactionModel } from 'src/domain/payment/model/transaction.model';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { UpdateTransactionStatusModel } from './../../../../domain/payment/model/transaction.model';

@Injectable()
export class TransactionRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    createTransactionModel: CreateTransactionModel,
    tx?: Prisma.TransactionClient,
  ): Promise<Transaction> {
    return (tx ?? this.prisma).transaction.create({
      data: {
        userId: createTransactionModel.userId,
        amount: createTransactionModel.amount,
        transactionType: createTransactionModel.transactionType,
      },
    });
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(
    updateTransactionStatusModel: UpdateTransactionStatusModel,
    tx?: Prisma.TransactionClient,
  ): Promise<Transaction> {
    const prisma = tx || this.prisma;
    return prisma.transaction.update({
      where: { id: updateTransactionStatusModel.transactionId },
      data: { transactionType: updateTransactionStatusModel.transactionType },
    });
  }

  async findById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Transaction | null> {
    const prisma = tx || this.prisma;
    return prisma.transaction.findUnique({ where: { id } });
  }
}
