import { UserPointTable } from "../../database/userpoint.table";
import {
  PointProcessorImpl,
  pointProcessorSymbol,
} from "./point.processor.impl";
import { PointHistoryTable } from "../../database/pointhistory.table";
import { Test, TestingModule } from "@nestjs/testing";
import { BullModule } from "@nestjs/bull";
import { Job } from "bull";
import { UserPoint } from "../point.model";
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

  describe("handleChargeJob", () => {
    it("should process charge job correctly", async () => {
      const job: Job = {
        data: { id: 1, amount: 100 },
      } as Job;
      let userPoint: UserPoint = {
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
});