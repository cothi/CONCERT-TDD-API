import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, Body } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { Queue } from "bull";
import { BullModule, getQueueToken } from "@nestjs/bull";

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let pointQueue: Queue;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        BullModule.forRoot({
          redis: {
            host: "localhost",
            port: 7777,
          },
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    pointQueue = moduleFixture.get<Queue>(getQueueToken("point-queue"));
  });

  afterAll(async () => {
    await pointQueue.empty();
    await app.close();
  });

  it("/point/:id/charge (PATCH)", async () => {
    const point = 100;
    const res = await request(app.getHttpServer())
      .patch("/point/1/charge")
      .send({ amount: point })
      .expect(200);

    expect(res.body.point).toEqual(point);
  });
});
