import { CommonModel } from "../../common/model/common.model";

export class UserPoint extends CommonModel {
  id?: number;
  point?: number;
  updateMillis?: number;
}

/**
 * 포인트 트랜잭션 종류
 * - CHARGE : 충전
 * - USE : 사용
 */
export enum TransactionType {
  CHARGE,
  USE,
}

export class PointHistory extends CommonModel {
  id?: number;
  userId?: number;
  type?: TransactionType;
  amount?: number;
  timeMillis?: number;
}