import { Test, TestingModule } from "@nestjs/testing";
import { PointService } from "./point.service";
import { UserPointTable } from "../database/userpoint.table";
import { PointHistoryTable } from "../database/pointhistory.table";
import { UserPoint } from "./point.model";

describe("PointService", () => {
  let service: PointService;
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
          },
        },
        {
          provide: PointHistoryTable,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PointService>(PointService);
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
});
