import { Injectable } from "@nestjs/common";
import { UserPointTable } from "../database/userpoint.table";
import { PointHistoryTable } from "../database/pointhistory.table";
import { UserPoint } from "./point.model";

@Injectable()
export class PointService {
  constructor(
    private readonly userDb: UserPointTable,
    private readonly historyDb: PointHistoryTable
  ) {}

  async getPointByUserId(userId: number): Promise<UserPoint> {
    return await this.userDb.selectById(userId);
  }
}
