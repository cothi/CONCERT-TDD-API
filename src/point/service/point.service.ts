import { PointBody } from "../point.dto";
import { PointHistory, UserPoint } from "../point.model";

export interface PointService {
  getPointByUserId(userId: number): Promise<UserPoint>;
  getPointHistoryByUserId(userId: number): Promise<PointHistory[]|PointHistory>;
  chargePoint(userId: number, pointDto: PointBody): Promise<UserPoint>;
  usePoint(userId: number, pointDto: PointBody): Promise<UserPoint>;
}
