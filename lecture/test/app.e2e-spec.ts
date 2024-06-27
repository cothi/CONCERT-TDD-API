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
          name: 'test1',
          email: 'test1@gmail.ai',
        })
        .expect(201);
    });

    it('/users/create (POST) - 유저를 50명까지 생성합니다.', async () => {
      for (let i = 2; i < 51; i++) {
        await request(app.getHttpServer())
          .post('/users/create')
          .send({
            name: `test${i}`,
            email: `test${i}@gmail.ai`, // 이메일은 중복이 되지 않도록 설정
          })
          .expect(201);
      }
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

  describe('/admin 관리자 관련 (e2e)', () => {
    it('/admin/create (POST) - 강의를 생성합니다.', async () => {
      const res = await request(app.getHttpServer())
        .post('/admin/create')
        .send({
          title: 'test',
          maxApplicants: 30,
        })
        .expect(201);

      expect(res.body.ok).toEqual(true);
    });

    it('/admin/get (GET) - 강의를 조회합니다.', async () => {
      const title = 'test';
      const res = await request(app.getHttpServer())
        .get(`/admin/${title}`)
        .expect(200);
      expect(res.body.ok).toEqual(true);
    });

    it('/admin/gets (GET) - 모든 강의를 조회합니다.', async () => {
      const res = await request(app.getHttpServer())
        .get('/admin/gets')
        .expect(200);

      expect(res.body.lectures).toEqual(expect.any(Array));
      expect(res.body.ok).toEqual(true);
    });

    // it('/lecture/cancel (DELETE) - 강의를 취소합니다.', async () => {
    //   const title = 'test';
    //   const res = await request(app.getHttpServer())
    //     .get(`/lecture/cancel/${title}`)
    //     .expect(200);

    //   expect(res.body.ok).toEqual(true);
    // });
  });

  describe('/lecture 강의 (e2e) ', () => {
    it('/lecture/apply (POST) - 특별 강의에 신청합니다.', async () => {
      const res = await request(app.getHttpServer())
        .post('/lecture/apply')
        .send({
          email: 'test1@gmail.ai',
          name: 'test',
          title: 'test',
        })
        .expect(201);
      expect(res.body.ok).toEqual(true);
    });

    it('/lecture/apply (POST) - 특별 강의에 50명까지 신청합니다', async () => {
      const successNum = 50;
      const failNum = 5;
      // 특강 생성
      const make = await request(app.getHttpServer())
        .post('/admin/create')
        .send({
          title: 'special',
          maxApplicants: successNum,
        })
        .expect(201);

      const usePromise = [];

      for (let i = 2; i < successNum + failNum + 2; i++) {
        usePromise.push(
          request(app.getHttpServer())
            .post('/lecture/apply')
            .send({
              email: `test${i}@gmail.ai`,
              name: `test${i}`,
              title: 'special',
            }),
        );
      }

      const results = await Promise.all(usePromise);
      for (let i = 0; i < successNum + failNum; i++) {
        console.log(results[i].body.ok, results[i].body.message, i);
      }
    }, 6000);

    it('/lecture/count/:title (GET) - 특별 강의, 가능 신청 인원을 조회합니다.', async () => {
      const title = 'test';
      const res = await request(app.getHttpServer())
        .get(`/lecture/count/${title}`)
        .expect(200);
      expect(res.body.ok).toEqual(true);
      expect(res.body.count).toEqual(expect.any(Number));
    });

    it('/lecture/:name (GET) - 유저가 수강할 특별 강의를 조회합니다.', async () => {
      const name = 'test';
      const res = await request(app.getHttpServer())
        .get(`/lecture/${name}`)
        .expect(200);
      expect(res.body.ok).toEqual(true);
    });
  });
});
