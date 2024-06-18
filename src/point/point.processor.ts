import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { UserPointTable } from "../database/userpoint.table";
import { PointHistoryTable } from "../database/pointhistory.table";
import { TransactionType } from "./point.model";

@Processor("point-queue")
export class PointProcessor {
  constructor(
    private readonly UserPointTable: UserPointTable,
    private readonly historyDb: PointHistoryTable
  ) {}
  @Process("charge")
  async handleCharge(job: Job<any>) {
    const { id, amount } = job.data;
    const userPoint = await this.UserPointTable.selectById(id);
    const newAmount = userPoint.point + amount;
    return await this.UserPointTable.insertOrUpdate(id, newAmount);
  }

  @Process("use")
  async handleUse(job: Job) {
    const { id, amount } = job.data;
    const userPoint = await this.UserPointTable.selectById(id);
    if (userPoint.point < amount) {
      throw new Error("포인트가 부족합니다.");
    }
    const newAmount = userPoint.point - amount;
    await this.historyDb.insert(id, amount, TransactionType.USE, Date.now());
    return await this.UserPointTable.insertOrUpdate(id, newAmount);
  }
}
