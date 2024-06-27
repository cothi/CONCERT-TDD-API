import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/users 유저 관련', () => {
    it('/users/create (POST) - 유저를 생성합니다.', async () => {
      await request(app.getHttpServer())
        .post('/users/create')
        .send({
          name: 'test1',
          email: 'test1@gmail.ai',
        })
        .expect(201);
    });

    it('/users/get (POST) - 유저를 생성할 때, 입력을 제대로하지 않으면 생성하지 않습니다.', async () => {
      const res = await request(app.getHttpServer())
        .post('/users/create')
        .send({
          name: undefined,
          email: '',
        });
      expect(res.body.ok).toEqual(false);
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
      await request(app.getHttpServer())
        .post('/admin/create')
        .send({
          title: 'test2',
          maxApplicants: 30,
        })
        .expect(201);

      expect(res.body.ok).toEqual(true);
    });

    it('/admin/create (POST) - 강의 생성 시, 입력을 제대로하지 않으면 생성하지 않습니다.', async () => {
      const res = await request(app.getHttpServer())
        .post('/admin/create')
        .send({
          title: undefined,
          maxApplicants: undefined,
        });
      expect(res.body.ok).toEqual(false);
    });

    it('/admin/get (GET) - 강의를 조회합니다.', async () => {
      const title = 'test';
      const res = await request(app.getHttpServer())
        .get(`/admin/${title}`)
        .expect(200);
      expect(res.body.ok).toEqual(true);
    });

    it('/lecture/gets (GET) - 모든 강의를 조회합니다.', async () => {
      const res = await request(app.getHttpServer())
        .get('/lecture/gets')
        .expect(200);

      expect(res.body.lectures).toEqual(expect.any(Array));
      expect(res.body.ok).toEqual(true);
    });

    it('/lecture/cancel (DELETE) - 강의를 취소합니다.', async () => {
      const title = 'test2';
      const res = await request(app.getHttpServer())
        .get(`/admin/cancel/${title}`)
        .expect(200);

      expect(res.body.ok).toEqual(true);
    });
  });

  describe('/lecture 강의 (e2e) ', () => {
    it('/lecture/apply (POST) - 강의 수강 신청합니다.', async () => {
      await request(app.getHttpServer())
        .post('/admin/create')
        .send({
          title: 'test',
          maxApplicants: 30,
        })
        .expect(201);
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

    it('/lecture/apply (POST) -  강의에 50명까지 수강 신청, 이후에 신청한 요청자는 수강에 실패합니다.', async () => {
      const successNum = 50;
      const failNum = 5;
      // 특강 생성
      await request(app.getHttpServer())
        .post('/admin/create')
        .send({
          title: 'special',
          maxApplicants: successNum,
        })
        .expect(201);

      // 성공 요청 만들기
      const usePromise = [];
      for (let i = 2; i < successNum + failNum + 2; i++) {
        usePromise.push(
          await request(app.getHttpServer())
            .post('/lecture/apply')
            .send({
              email: `test${i}@gmail.ai`,
              name: `test${i}`,
              title: 'special',
            }),
        );
      }

      const results = await Promise.all(usePromise);
      // 성공한 요청은 50개
      const requestSuccessNum = results.filter(
        (res) => res.body.ok === true,
      ).length;
      const requestFailedNum = results.filter(
        (res) => res.body.ok === false,
      ).length;

      for (let i = 50; i < 55; i++) {
        expect(results[i].body.ok).toEqual(false);
      }
      expect(requestSuccessNum).toEqual(successNum);
      expect(requestFailedNum).toEqual(failNum);
    }, 30000);

    it('/lecture/count/:title (GET) - 특별 강의, 가능한 수강 신청 인원을 조회합니다.', async () => {
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
  afterAll(async () => {
    await app.close();
  });
});
