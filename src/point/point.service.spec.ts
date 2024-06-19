import { Test, TestingModule } from "@nestjs/testing";
import { PointService } from "./point.service";
import { UserPointTable } from "../database/userpoint.table";
import { PointHistoryTable } from "../database/pointhistory.table";
import { PointHistory, TransactionType, UserPoint } from "./point.model";
import { PointBody } from "./point.dto";
import { BullModule, getQueueToken } from "@nestjs/bull";
import { Job, Queue } from "bull";

describe("PointService", () => {
  let service: PointService;
  let pointQueue: jest.Mocked<Queue>;
  let userDB: jest.Mocked<UserPointTable>;
  let pointHistoryDB: jest.Mocked<PointHistoryTable>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PointService,
        {
          provide: UserPointTable,
          useValue: {
            selectById: jest.fn(),
            insertOrUpdate: jest.fn(),
          },
        },
        {
          provide: PointHistoryTable,
          useValue: {
            insert: jest.fn(),
            selectAllByUserId: jest.fn(),
          },
        },
        {
          provide: getQueueToken("point-queue"),
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PointService>(PointService);
    pointQueue = module.get(getQueueToken("point-queue"));
    userDB = module.get(UserPointTable);
    pointHistoryDB = module.get(PointHistoryTable);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return the correct user point", async () => {
    const userId = 1;
    const dateNow = Date.now();
    const userPoint: UserPoint = {
      id: userId,
      point: 100,
      updateMillis: dateNow,
    };
    userDB.selectById.mockResolvedValue(userPoint);
    const result = await service.getPointByUserId(userId);

    expect(userDB.selectById).toHaveBeenCalledWith(userId);
    expect(result).toEqual(userPoint);
  });

  it("should return point history", async () => {
    const userId = 1;
    const pointHistory: PointHistory = {
      id: 1,
      userId: userId,
      type: TransactionType.CHARGE,
      amount: 100,
      timeMillis: Date.now(),
    };
    pointHistoryDB.selectAllByUserId.mockResolvedValue([pointHistory]);
    const result = await service.getPointHistoryByUserId(userId);

    expect(pointHistoryDB.selectAllByUserId).toHaveBeenCalledWith(userId);
    expect(result).toEqual([pointHistory]);
  });

  it("should charge the user point", async () => {
    const userId = 1;

    // 충전 요청 포인트
    const pointDto: PointBody = {
      amount: 100,
    };
    const userPoint: UserPoint = {
      id: userId,
      point: 100,
      updateMillis: Date.now(),
    };
    const mockJob: Partial<Job<any>> = {
      finished: jest.fn().mockResolvedValue(userPoint),
    };
    pointQueue.add.mockImplementation(() =>
      Promise.resolve(mockJob as Job<any>)
    );

    const res = await service.chargePoint(userId, pointDto);
    expect(res).toEqual(userPoint);
  });

  it("should use the user point", async () => {
    const userId = 1;
    const pointDto: PointBody = {
      amount: 10,
    };
    const userPoint: UserPoint = {
      id: 1,
      point: 1000,
      updateMillis: Date.now(),
    };
    const afterUserPoint: UserPoint = {
      id: 1,
      point: 990,
      updateMillis: Date.now(),
    };
    const mockJob: Partial<Job<any>> = {
      finished: jest.fn().mockResolvedValue(userPoint),
    };
    pointQueue.add.mockImplementation(() =>
      Promise.resolve(mockJob as Job<any>)
    );

    // 포인
    const chargeResult = await service.usePoint(userId, pointDto);
    expect(chargeResult).toEqual(userPoint);

    const mockUseJob: Partial<Job<any>> = {
      finished: jest.fn().mockResolvedValue(afterUserPoint),
    };
    pointQueue.add.mockImplementation(() =>
      Promise.resolve(mockUseJob as Job<any>)
    );

    // 포인트 사용
    const res = await service.usePoint(userId, pointDto);
    expect(res).toEqual(afterUserPoint);
  });
});
