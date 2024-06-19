import { CommonDto } from "../common/dto/common.dto";

export class UserPoint extends CommonDto {
  id?: number;
  point?: number;
  updateMillis?: number;
}

export type CommonModel = {
  ok: boolean;
  error: string;
};

/**
 * 포인트 트랜잭션 종류
 * - CHARGE : 충전
 * - USE : 사용
 */
export enum TransactionType {
  CHARGE,
  USE,
}

export class PointHistory extends CommonDto {
  id?: number;
  userId?: number;
  type?: TransactionType;
  amount?: number;
  timeMillis?: number;
}
