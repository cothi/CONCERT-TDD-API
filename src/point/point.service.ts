import { Injectable } from "@nestjs/common";
import { UserPointTable } from "../database/userpoint.table";
import { PointHistoryTable } from "../database/pointhistory.table";
import { PointHistory, UserPoint } from "./point.model";

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
}
