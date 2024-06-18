import { UserPointTable } from "../database/userpoint.table";
import { PointProcessor } from "./point.processor";
import { Test, TestingModule } from "@nestjs/testing";
import { Job } from "bull";
import { UserPoint } from "../../dist/point/point.model";

describe("PointProcessor", () => {
  let pointProcessor: PointProcessor;
  let userDB: jest.Mocked<UserPointTable>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PointProcessor,
        {
          provide: UserPointTable,
          useValue: {
            selectById: jest.fn(),
            insertOrUpdate: jest.fn(),
          },
        },
      ],
    }).compile();
    pointProcessor = module.get<PointProcessor>(PointProcessor);
    userDB = module.get(UserPointTable);
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
