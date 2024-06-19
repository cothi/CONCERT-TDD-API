import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  ValidationPipe,
} from "@nestjs/common";
import { PointHistory, TransactionType, UserPoint } from "./point.model";
import { PointBody, PointBody as PointDto } from "./point.dto";
import { pointServiceSymbol } from "./service/point.service.impl";
import { PointService } from "./service/point.service";

@Controller("/point")
export class PointController {
  constructor(
    @Inject(pointServiceSymbol)
    private readonly pointService: PointService
  ) {}

  /**
   * TODO - 특정 유저의 포인트를 조회하는 기능을 작성해주세요.
   */
  /**
   * 사용자의 포인트를 조회합니다.
   * @param id 사용자의 ID (URL 매개변수)
   * @returns 사용자의 포인트 정보
   */
  @Get(":id")
  async point(@Param("id", ParseIntPipe) id: number): Promise<UserPoint> {
    //return { id: userId, point: 0, updateMillis: Date.now() };
    return await this.pointService.getPointByUserId(id);
  }

  /**
   * TODO - 특정 유저의 포인트 충전/이용 내역을 조회하는 기능을 작성해주세요.
   */
  /**
   * 특정 사용자의 포인트 충적/이용 내역을 조회합니다.
   * @param id
   * @returns
   */
  @Get(":id/histories")
  async history(
    @Param("id", ParseIntPipe) id: number
  ): Promise<PointHistory[]|PointHistory> {
    return await this.pointService.getPointHistoryByUserId(id);
  }

  /**
   * TODO - 특정 유저의 포인트를 충전하는 기능을 작성해주세요.
   */
  /**
   * 특정 유저의 포인트를 충전합니다.
   * @param id
   * @param pointDto
   * @returns
   */
  @Patch(":id/charge")
  async charge(
    @Param("id", ParseIntPipe) id: number,
    @Body(ValidationPipe) pointDto: PointBody
  ): Promise<UserPoint> {
    return await this.pointService.chargePoint(id, pointDto);
  }

  /**
   * TODO - 특정 유저의 포인트를 사용하는 기능을 작성해주세요.
   */
  /**
   * 특정 유저의 포인트를 사용하기는 기능 작성
   * @param id
   * @param pointDto
   * @returns
   */
  @Patch(":id/use")
  async use(
    @Param("id", ParseIntPipe) id: number,
    @Body(ValidationPipe) pointDto: PointDto
  ): Promise<UserPoint> {
    // const amount = pointDto.amount;
    return await this.pointService.usePoint(id, pointDto);
  }
}
