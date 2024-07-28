import {
  CreateTransactionModel,
  GetTransactionByIdModel,
  GetTransactionByUserIdModel,
  TransactionModel,
  UpdateTransactionStatusModel,
} from 'src/domain/payment/model/transaction.model';
import {
  CreateTransactionEntity,
  GetTransactionByIdEntity,
  GetTransactionByUserIdEntity,
  UpdateTransactionEntity,
} from '../entity/transaction.entity';
import { Transaction } from '@prisma/client';

export class TransactionMapper {
  static toMapCreateTransactionEntity(
    model: CreateTransactionModel,
  ): CreateTransactionEntity {
    const entity = new CreateTransactionEntity();
    entity.amount = model.amount;
    entity.transactionType = model.transactionType;
    entity.userId = model.userId;
    return entity;
  }

  static toMapGetTransactionByUserIdEntity(
    model: GetTransactionByUserIdModel,
  ): GetTransactionByUserIdEntity {
    const entity = new GetTransactionByUserIdEntity();
    entity.userId = model.userId;
    return entity;
  }
  static toMapGetTransactionByIdEntity(
    model: GetTransactionByIdModel,
  ): GetTransactionByIdEntity {
    const entity = new GetTransactionByIdEntity();
    entity.id = model.transactionId;
    return entity;
  }

  static toMapUpdateTransactionEntity(
    model: UpdateTransactionStatusModel,
  ): UpdateTransactionEntity {
    const entity = new UpdateTransactionEntity();
    entity.id = model.transactionId;
    entity.transactionType = model.transactionType;
    return entity;
  }
  static toMapTransactionModel(entity: Transaction): TransactionModel {
    if (!entity) return null;
    const model = TransactionModel.create(
      entity.id,
      entity.userId,
      entity.amount,
      entity.transactionType,
    );
    return model;
  }
  static toMapTransactionModels(entities: Transaction[]): TransactionModel[] {
    return entities.map((entity) => this.toMapTransactionModel(entity));
  }
}
