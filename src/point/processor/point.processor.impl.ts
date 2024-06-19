import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { UserPointTable } from "../../database/userpoint.table";
import { PointHistoryTable } from "../../database/pointhistory.table";
import { TransactionType } from "../point.model";
import { PointProcessor } from "./point.processor";

export const pointProcessorSymbol = Symbol("PointProcessor");
@Processor("point-queue")
export class PointProcessorImpl implements PointProcessor {
  constructor(
    private readonly UserPointTable: UserPointTable,
    private readonly historyDb: PointHistoryTable
  ) {}

  /**
   * 순차적으로 포인트를 충전하는 함수
   * @param job
   * @returns Promise<UserPoint>
   */
  @Process("charge")
  async handleCharge(job: Job) {
    const { id, amount } = job.data;
    const userPoint = await this.UserPointTable.selectById(id);
    const newAmount = userPoint.point + amount;
    return await this.UserPointTable.insertOrUpdate(id, newAmount);
  }

  /**
   * 순차적으로 포인트를 사용하는 함포
   * @param job
   * @returns Promise<UserPoint>
   */
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
