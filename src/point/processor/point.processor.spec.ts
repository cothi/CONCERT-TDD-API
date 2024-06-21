import { UserPointTable } from "../../database/userpoint.table";
import {
  PointProcessorImpl,
  pointProcessorSymbol,
} from "./point.processor.impl";
import { PointHistoryTable } from "../../database/pointhistory.table";
import { Test, TestingModule } from "@nestjs/testing";
import { BullModule } from "@nestjs/bull";
import { Job } from "bull";
import { UserPoint } from "../model/point.model";
import { PointProcessor } from "./point.processor";

describe("PointProcessor", () => {
  let pointProcessor: PointProcessor;
  let userDB: jest.Mocked<UserPointTable>;
  let pointDB: jest.Mocked<PointHistoryTable>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BullModule.forRoot({
          redis: {
            host: "localhost",
            port: 6380,
          },
        }),
        BullModule.registerQueue({
          name: "point-queue",
        }),
      ],
      providers: [
        {
          provide: pointProcessorSymbol,
          useClass: PointProcessorImpl,
        },
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
      ],
    }).compile();
    pointProcessor = module.get<PointProcessor>(pointProcessorSymbol);
    userDB = module.get(UserPointTable);
    pointDB = module.get(PointHistoryTable);
  });

  describe("포인트 충전", () => {
    it("포인트 충전이 올바르게 작동되어야 한다.", async () => {
      const job: Job = {
        data: { id: 1, amount: 100 },
      } as Job;
      let userPoint: UserPoint = {
        ok: true,
        id: 1,
        point: 100,
        updateMillis: Date.now(),
      };

      userDB.selectById.mockResolvedValue(userPoint);
      userPoint.point += job.data.amount;
      userDB.insertOrUpdate.mockResolvedValue(userPoint);

      const result = await pointProcessor.handleCharge(job);
      expect(result).toEqual(userPoint);
    });
  });
  describe("포인트 사용", () => {});

  describe("동시성 테스트", () => {
    it("포인트 충전이 동시에 발생할 경우, 충전이 올바르게 작동되어야 한다.", async () => {
      const job: Job = {
        data: { id: 1, amount: 100 },
      } as Job;
      let userPoint: UserPoint = {
        ok: true,
        id: 1,
        point: 100,
        updateMillis: Date.now(),
      };

      userDB.selectById.mockResolvedValue(userPoint);
      userPoint.point += job.data.amount;
      userDB.insertOrUpdate.mockResolvedValue(userPoint);

      const result = await Promise.all([
        pointProcessor.handleCharge(job),
        pointProcessor.handleCharge(job),
        pointProcessor.handleCharge(job),
      ]);
      expect(result).toEqual([userPoint, userPoint, userPoint]);
    });
  });

  describe("부하테스트", () => {
    it("포인트 충전이 1000번 동시에 발생할 경우, 충전이 올바르게 작동되어야 한다.", async () => {
      const job: Job = {
        data: { id: 1, amount: 10 },
      } as Job;

      let userPoint: UserPoint = {
        ok: true,
        id: 1,
        point: 100,
        updateMillis: Date.now(),
      };
      userDB.selectById.mockResolvedValue(userPoint);
      userDB.insertOrUpdate.mockResolvedValue(userPoint);
      const jobCount = 1000;
      const jobs = Array(jobCount).fill(job);
      const result = await Promise.all(
        jobs.map(() => pointProcessor.handleCharge(job))
      );
      expect(result.length).toEqual(jobCount);
      result.forEach((res) => {
        expect(res).toEqual(userPoint);
      });
    });
  });
});
