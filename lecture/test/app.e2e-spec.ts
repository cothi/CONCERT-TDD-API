import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/users 유저 관련', () => {
    it('/users/create (POST) - 유저를 생성합니다.', async () => {
      const res = await request(app.getHttpServer())
        .post('/users/create')
        .send({
          name: 'test',
          email: 'test1@gmail.ai',
        })
        .expect(201);
    });

    it('/users/get (POST) - 유저를 조회합니다.', async () => {
      const res = await request(app.getHttpServer()).post('/users/get').send({
        email: 'test1@gmail.ai',
      });
      expect(res.body.ok).toEqual(true);
    });
    it('/users (GET) - 모든 유저를 조회합니다.', async () => {
      const res = await request(app.getHttpServer()).get('/users');
      expect(res.body.ok).toEqual(true);
    });
  });
});
