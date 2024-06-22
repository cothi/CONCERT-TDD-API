import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { UserPointTable } from "../../database/userpoint.table";
import { PointHistoryTable } from "../../database/pointhistory.table";
import { PointHistory, TransactionType, UserPoint } from "../model/point.model";
import { PointBody } from "../dto/point.dto";
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
    this.isValidId(userId);
    try {
      const res = await this.userDb.selectById(userId);
      return { ...res, ok: true };
    } catch (e) {
      return {
        ok: false,
        id: userId,
        error: "조회할 수 없습니다.",
        updateMillis: Date.now(),
      };
    }
  }

  /**
   * 포인트 사용/충전 내역 조회
   * @param userId
   * @returns PointHistory[]
   */
  async getPointHistoryByUserId(userId: number): Promise<PointHistory[]> {
    this.isValidId(userId);

    try {
      const res = await this.historyDb.selectAllByUserId(userId);
      return res;
    } catch (e) {
      return [
        {
          userId: userId,
          ok: false,
          error: "조회할 수 없습니다",
          id: userId,
          timeMillis: Date.now(),
        },
      ];
    }
  }

  /**
   * 포인트 충전 기능
   * @param userId
   * @param pointDto
   * @returns UserPoint
   */
  async chargePoint(userId: number, pointDto: PointBody): Promise<UserPoint> {
    this.isValidId(userId);

    try {
      const job = await this.pointQueue.add("charge", {
        id: userId,
        amount: pointDto.amount,
      });
      const res = await job.finished();
      return { ...res, ok: true };
    } catch (e) {
      return {
        ok: false,
        error: "충전할 수 없습니다.",
        id: userId,
        updateMillis: Date.now(),
      };
    }
  }
  /**
   * 포인트 사용 기능
   * @param userId
   * @param pointDto
   * @returns UserPoint
   */
  async usePoint(userId: number, pointDto: PointBody): Promise<UserPoint> {
    this.isValidId(userId);
    try {
      const job = await this.pointQueue.add("use", {
        id: userId,
        amount: pointDto.amount,
      });
      const res = await job.finished();
      return res;
    } catch (e) {
      return {
        ok: false,
        error: "포인트를 사용할 수 없습니다.",
        id: userId,
        updateMillis: Date.now(),
      };
    }
  }

  // 유효한 id인지 확인
  private isValidId(id: number): void {
    if (id <= 0) {
      throw new BadRequestException("유저 id가 올바르지 않습니다.");
    }
  }
}
