import { PointBody } from "../dto/point.dto";
import { PointHistory, UserPoint } from "../model/point.model";

export interface PointService {
  getPointByUserId(userId: number): Promise<UserPoint>;
  getPointHistoryByUserId(userId: number): Promise<PointHistory[]>;
  chargePoint(userId: number, pointDto: PointBody): Promise<UserPoint>;
  usePoint(userId: number, pointDto: PointBody): Promise<UserPoint>;
}
