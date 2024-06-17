import { Injectable } from "@nestjs/common";
import { UserPointTable } from "../database/userpoint.table";
import { PointHistoryTable } from "../database/pointhistory.table";
import { PointHistory, TransactionType, UserPoint } from "./point.model";
import { PointBody } from "./point.dto";

@Injectable()
export class PointService {
  constructor(
    private readonly userDb: UserPointTable,
    private readonly historyDb: PointHistoryTable
  ) {}

  async getPointByUserId(userId: number): Promise<UserPoint> {
    return await this.userDb.selectById(userId);
  }

  async getPointHistoryByUserId(userId: number): Promise<PointHistory[]> {
    return await this.historyDb.selectAllByUserId(userId);
  }

  // 포인트를 충전하는 기능
  async chargePoint(userId: number, pointDto: PointBody): Promise<UserPoint> {
    const userPoint = await this.userDb.selectById(userId);
    const newPoint = userPoint.point + pointDto.amount;
    await this.userDb.insertOrUpdate(userId, newPoint);
    await this.historyDb.insert(
      userId,
      pointDto.amount,
      TransactionType.CHARGE,
      Date.now()
    );

    return await this.userDb.selectById(userId);
  }

  async usePoint(userId: number, pointDto: PointBody): Promise<UserPoint> {
    const userPoint = await this.userDb.selectById(userId);
    if (userPoint.point < pointDto.amount) {
      throw new Error("포인트가 부족합니다.");
    }

    const newPoint = userPoint.point - pointDto.amount;
    await this.userDb.insertOrUpdate(userId, newPoint);
    await this.historyDb.insert(
      userId,
      pointDto.amount,
      TransactionType.USE,
      Date.now()
    );

    return await this.userDb.selectById(userId);
  }
}
