import {
  GetPaymentsByUserIdModel,
  PaymentModel,
  RecordPaymentModel,
} from 'src/domain/points/model/payment.model';
import {
  GetPointHistoryByUserIdEntity,
  RecordPointHistoryEntity,
} from '../entity/point-payment.entity';
import { Payment } from '@prisma/client';

export class PointPaymentMapper {
  static toMapRecordPointHistoryEntity(
    model: RecordPaymentModel,
  ): RecordPointHistoryEntity {
    const entity = new RecordPointHistoryEntity();
    entity.amount = model.amount;
    entity.paymentType = model.type;
    entity.userId = model.userId;
    return entity;
  }

  static toMapGetPointHistoryByUserIdEntity(
    model: GetPaymentsByUserIdModel,
  ): GetPointHistoryByUserIdEntity {
    const entity = new GetPointHistoryByUserIdEntity();
    entity.userId = model.userId;
    return entity;
  }
  static toMapPaymentModel(entity: Payment): PaymentModel {
    if (!entity) return null;
    const model = PaymentModel.create(
      entity.amount,
      entity.userId,
      entity.paymentType,
      entity.id,
    );
    return model;
  }
  static toMapPaymentModels(entities: Payment[]): PaymentModel[] {
    return entities.map((entity) => this.toMapPaymentModel(entity));
  }
}
