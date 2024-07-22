import { Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/infrastructure/payment/transaction.repository';
import { PrismaTransaction } from 'src/infrastructure/prisma/types/prisma.types';
import {
  CreateTransactionModel,
  GetTransactionByUserIdModel,
  TransactionModel,
  UpdateTransactionStatusModel,
} from '../model/transaction.model';

@Injectable()
export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async createTransaction(
    model: CreateTransactionModel,
    tx?: PrismaTransaction,
  ): Promise<TransactionModel> {
    return await this.transactionRepository.create(model, tx);
  }

  async getTransactionsByUserId(
    model: GetTransactionByUserIdModel,
    tx?: PrismaTransaction,
  ): Promise<TransactionModel[]> {
    return await this.transactionRepository.findByUserId(model, tx);
  }

  async updateTransactionStatus(
    model: UpdateTransactionStatusModel,
    tx?: PrismaTransaction,
  ): Promise<TransactionModel> {
    return await this.transactionRepository.updateStatus(model, tx);
  }
}
