import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, Body } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { Queue } from "bull";
import { BullModule, getQueueToken } from "@nestjs/bull";

describe("PointController (e2e)", () => {
  let app: INestApplication;
  let pointQueue: Queue;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        BullModule.forRoot({
          redis: {
            host: "localhost",
            port: 6380,
          },
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    pointQueue = moduleFixture.get<Queue>(getQueueToken("point-queue"));
  });

  afterEach(async () => {
    await pointQueue.empty();
    await app.close();
  });
  describe("포인트 조회", () => {
    it("/point/:id (GET) - 유저 포인트 조회가 가능해야 합니다.", async () => {
      const userId = 1;
      const res = await request(app.getHttpServer())
        .get(`/point/${userId}`)
        .expect(200);
      expect(res.body.point).toEqual(0);
    });

    it("/point/:id (GET) - 올바르지 않은 유저 ID로 조회 시 400 에러를 반환해야 합니다.", async () => {
      const userId = -1;
      await request(app.getHttpServer()).get(`/point/${userId}`).expect(400);
    });
  });

  describe("포인트 충전/사용 내역", () => {
    it("/point/:id/histories (GET) - 유저 포인트 사용/충전 내역이 조회할 수 있어야 합니다.", async () => {
      const userId = 1;
      const res = await request(app.getHttpServer())
        .get(`/point/${userId}/histories`)
        .expect(200);
      expect(res.body).toEqual([]);
    });
  });

  describe("포인트 충전", () => {
    it("/point/:id/charge (PATCH) - 유저 포인트 충전이 가능해야 합니다.", async () => {
      const point = 100;
      const userId = 1;
      const res = await request(app.getHttpServer())
        .patch(`/point/${userId}/charge`)
        .send({ amount: point })
        .expect(200);

      expect(res.body.point).toEqual(point);
    });
  });

  describe("포인트 사용", () => {
    it("/point/:id/use (PATCH) - 유저 포인트가 충전 후 사용이 가능해야 합니다.", async () => {
      const point = 1000;
      const usePoint = 90;
      const userId = 1;
      await request(app.getHttpServer())
        .patch(`/point/${userId}/charge`)
        .send({ amount: point })
        .expect(200);

      const res = await request(app.getHttpServer())
        .patch(`/point/${userId}/use`)
        .send({ amount: usePoint })
        .expect(200);
      console.log(res.body);
      expect(res.body.point).toEqual(point - usePoint);
    });
  });

  describe("동시성 테스트", () => {
    it("포인트 충전이 동시에 발생할 경우, 충전이 올바르게 작동되어야 합니다.", async () => {
      const point = 100;
      const userId = 1;
      const work1 = async () => {
        return await request(app.getHttpServer())
          .patch(`/point/${userId}/charge`)
          .send({ amount: point });
      };
      const work2 = async () => {
        return await request(app.getHttpServer())
          .patch(`/point/${userId}/charge`)
          .send({ amount: point });
      };
      const work3 = async () => {
        return await request(app.getHttpServer())
          .patch(`/point/${userId}/charge`)
          .send({ amount: point });
      };
      const res = await Promise.all([work1(), work2(), work3()]);

      expect(res[0].body.point).toEqual(point);
      expect(res[1].body.point).toEqual(point * 2);
      expect(res[2].body.point).toEqual(point * 3);
    });

    it("포인트를 충전 후 동시에 사용할 경우, 충전과 사용이 올바르게 작동되어야 합니다.", async () => {
      const point = 100;
      const usePoint = 10;
      const userId = 1;
      const work1 = async () => {
        return await request(app.getHttpServer())
          .patch(`/point/${userId}/charge`)
          .send({ amount: point });
      };
      const work2 = async () => {
        return await request(app.getHttpServer())
          .patch(`/point/${userId}/use`)
          .send({ amount: usePoint });
      };
      const work3 = async () => {
        return await request(app.getHttpServer())
          .patch(`/point/${userId}/use`)
          .send({ amount: usePoint });
      };
      const work4 = async () => {
        return await request(app.getHttpServer())
          .patch(`/point/${userId}/use`)
          .send({ amount: usePoint });
      };

      const res = await Promise.all([work1(), work2(), work3(), work4()]);
      expect(res[0].body.point).toEqual(point);
      expect(res[1].body.point).toEqual(point - 10);
      expect(res[2].body.point).toEqual(point - 20);
      expect(res[3].body.point).toEqual(point - 30);
    });
  });
});
