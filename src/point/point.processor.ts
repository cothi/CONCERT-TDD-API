import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { UserPointTable } from "../database/userpoint.table";

@Processor("point-queue")
export class PointProcessor {
  constructor(private readonly UserPointTable: UserPointTable) {}
  @Process("charge")
  async handleCharge(job: Job<any>) {
    const { id, amount } = job.data;
    const userPoint = await this.UserPointTable.selectById(id);
    const newAmount = userPoint.point + amount;
    return await this.UserPointTable.insertOrUpdate(id, newAmount);
  }

  @Process("use")
  async handleUse(job: Job) {}
}
