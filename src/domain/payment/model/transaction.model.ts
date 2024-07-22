import { PickType } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class TransactionModel {
  transactionId: string;
  userId: string;
  amount: Decimal;
  transactionType: TransactionType;
  static create(
    transactionId: string,
    userId: string,
    amount: Decimal,
    transactionType: TransactionType,
  ) {
    const model = new TransactionModel();
    model.amount = amount;
    model.transactionId = transactionId;
    model.transactionType = transactionType;
    model.userId = userId;
    return model;
  }
}

export class CreateTransactionModel extends PickType(TransactionModel, [
  'userId',
  'amount',
  'transactionType',
]) {
  static create(
    userId: string,
    amount: Decimal,
    transactionType: TransactionType,
  ): CreateTransactionModel {
    const model = new CreateTransactionModel();
    model.amount = amount;
    model.transactionType = transactionType;
    model.userId = userId;
    return model;
  }
}

export class UpdateTransactionStatusModel extends PickType(TransactionModel, [
  'transactionId',
  'transactionType',
]) {
  static create(transactionId: string, transactionType: TransactionType) {
    const model = new UpdateTransactionStatusModel();
    model.transactionId = transactionId;
    model.transactionType = transactionType;
  }
}

export class GetTransactionByUserIdModel extends PickType(TransactionModel, [
  'userId',
]) {
  static create(userId: string) {
    const model = new GetTransactionByUserIdModel();
    model.userId = userId;
    return model;
  }
}
export class GetTransactionByIdModel extends PickType(TransactionModel, [
  'transactionId',
]) {
  static create(transactionId: string) {
    const model = new GetTransactionByIdModel();
    model.transactionId = transactionId;
    return model;
  }
}
