import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, Body } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/ (GET)", () => {
    return request(app.getHttpServer())
      .get("/")
      .expect(200)
      .expect("Hello World!");
  });

  it("/point/1/charge (patch)", async () => {
    const res = await request(app.getHttpServer())
      .patch("/point/1/charge")
      .send({ amount: 100 })
      .expect(200);
    const res2 = await request(app.getHttpServer())
      .patch("/point/1/charge")
      .send({ amount: 100 })
      .expect(200);
  });
});
