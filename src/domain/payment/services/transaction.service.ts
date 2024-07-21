import { Injectable } from '@nestjs/common';
import { Prisma, Transaction } from '@prisma/client';
import { TransactionRepository } from 'src/infrastructure/payment/payment.repository';
import {
  CreateTransactionModel,
  UpdateTransactionStatusModel,
} from '../model/transaction.model';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async createTransaction(
    createTransactionModel: CreateTransactionModel,
    tx?: Prisma.TransactionClient,
  ): Promise<Transaction> {
    return this.transactionRepository.create(createTransactionModel, tx);
  }

  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.findByUserId(userId);
  }

  async updateTransactionStatus(
    updateTransactionStatusModel: UpdateTransactionStatusModel,
    tx?: Prisma.TransactionClient,
  ): Promise<Transaction> {
    return this.transactionRepository.updateStatus(
      updateTransactionStatusModel,
      tx,
    );
  }
}
