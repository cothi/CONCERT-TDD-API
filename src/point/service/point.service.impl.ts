import { Injectable } from "@nestjs/common";
import { UserPointTable } from "../../database/userpoint.table";
import { PointHistoryTable } from "../../database/pointhistory.table";
import { PointHistory, TransactionType, UserPoint } from "../point.model";
import { PointBody } from "../point.dto";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";
import { PointService } from "./point.service";


export const pointServiceSymbol = Symbol("PointService");

@Injectable()
export class PointServiceImpl implements PointService {
  constructor(
    private readonly userDb: UserPointTable,
    private readonly historyDb: PointHistoryTable,
    @InjectQueue("point-queue") private readonly pointQueue: Queue
  ) {}

  /**
   * @param userId
   * @returns UserPoint
   * 포인트 조회
   */
  async getPointByUserId(userId: number): Promise<UserPoint> {
    return await this.userDb.selectById(userId);
  }

  /**
   * @param userId
   * @returns PointHistory[]
   * 포인트 사용/충전 내역 조회
   */
  async getPointHistoryByUserId(userId: number): Promise<PointHistory[]> {
    return await this.historyDb.selectAllByUserId(userId);
  }

  /**
   * @param userId
   * @param pointDto
   * @returns UserPoint
   * 포인트 충전 기능
   */
  async chargePoint(userId: number, pointDto: PointBody): Promise<UserPoint> {
    const amount = pointDto.amount;
    const job = await this.pointQueue.add("charge", {
      id: userId,
      amount: amount,
    });
    const res = await job.finished();
    return res;
  }
  /**
   * @param userId
   * @param pointDto
   * @returns UserPoint
   * 포인트 사용 기능
   */
  async usePoint(userId: number, pointDto: PointBody): Promise<UserPoint> {
    const job = await this.pointQueue.add("use", {
      id: userId,
      amount: pointDto.amount,
    });
    const res = await job.finished();
    return res;
  }
}
