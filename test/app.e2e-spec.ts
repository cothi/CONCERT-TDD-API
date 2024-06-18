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
  it("/point/:id (GET) - should return user point", async () => {
    const userId = 1;
    const res = await request(app.getHttpServer())
      .get(`/point/${userId}`)
      .expect(200);
  });

  it("/point/:id/history (GET) - should return user point history", async () => {});

  it("/point/:id/charge (PATCH)", async () => {
    const point = 100;
    const userId = 1;
    const res = await request(app.getHttpServer())
      .patch(`/point/${userId}/charge`)
      .send({ amount: point })
      .expect(200);

    expect(res.body.point).toEqual(point);
  });

  it("/point/:id/use (PATCH)", async () => {
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
    expect(res.body.point).toEqual(point - usePoint);
  });
});
