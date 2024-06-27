import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { create } from 'domain';
import exp from 'constants';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const createUser = (name: string, email: string) =>
    request(app.getHttpServer()).post('/users/create').send({ name, email });
  const createLecture = (title: string, maxApplicants: number) =>
    request(app.getHttpServer())
      .post('/admin/create')
      .send({ title, maxApplicants });

  const applyLecture = (email: string, name: string, title: string) =>
    request(app.getHttpServer())
      .post('/lecture/apply')
      .send({ email, name, title });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/users 유저 관련 테스트', () => {
    it('/users/create (POST) - 유저를 생성합니다.', async () => {
      await createUser('test1', 'test1@gmail.ai').expect(201);
    });

    it('/users/get (POST) - 유저를 생성할 때, 입력을 제대로하지 않으면 생성하지 않습니다.', async () => {
      const res = await createUser(undefined, '');
      expect(res.body.ok).toBeFalsy();
    });

    it('/users/create (POST) - 유저를 100명까지 생성합니다.', async () => {
      for (let i = 2; i < 51; i++) {
        await createUser(`test${i}`, `test${i}@gmail.ar`).expect(201);
      }
    });

    it('/users/get (POST) - 유저를 조회합니다.', async () => {
      const res = await request(app.getHttpServer()).post('/users/get').send({
        email: 'test1@gmail.ai',
      });
      expect(res.body.ok).toBeTruthy();
    });
    it('/users (GET) - 모든 유저를 조회합니다.', async () => {
      const res = await request(app.getHttpServer()).get('/users');
      expect(res.body.ok).toEqual(true);
    });
  });

  describe('/admin 관리자 관련 (e2e)', () => {
    it('/admin/create (POST) - 강의를 생성합니다.', async () => {
      const res = await createLecture('test', 30).expect(201);
      expect(res.body.ok).toEqual(true);

      const res2 = await createLecture('test2', 30).expect(201);
      expect(res2.body.ok).toEqual(true);
    });

    it('/admin/create (POST) - 강의 생성 시, 입력을 제대로하지 않으면 생성하지 않습니다.', async () => {
      const res = await createLecture(undefined, undefined);
      expect(res.body.ok).toEqual(false);
    });

    it('/admin/get (GET) - 강의를 조회합니다.', async () => {
      const title = 'test';
      const res = await request(app.getHttpServer())
        .get(`/admin/${title}`)
        .expect(200);
      expect(res.body.ok).toEqual(true);
    });

    it('/admin/cancel (DELETE) - 강의를 취소합니다.', async () => {
      const title = 'test2';
      const res = await request(app.getHttpServer())
        .get(`/admin/cancel/${title}`)
        .expect(200);

      expect(res.body.ok).toEqual(true);
    });
  });

  describe('/lecture 강의 (e2e) ', () => {
    it('/lecture/gets (GET) - 모든 강의를 조회합니다.', async () => {
      const res = await request(app.getHttpServer())
        .get('/lecture/gets')
        .expect(200);

      expect(res.body.lectures).toEqual(expect.any(Array));
      expect(res.body.ok).toEqual(true);
    });

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
      const MAX_APPLICANTS = 50;
      const EXTRA_APPLICANTS = 5;
      const TOTAL_APPLICANTS = MAX_APPLICANTS + EXTRA_APPLICANTS;
      // 특강 생성
      await createLecture('special', MAX_APPLICANTS).expect(201);

      const applys = [];
      for (let i = 1; i <= TOTAL_APPLICANTS; i++) {
        const res = await applyLecture(
          `test${i + 1}@gmail.ai`,
          `test${i + 1}`,
          'special',
        );
        applys.push(res);
      }

      const results = await Promise.all(applys);
      const successApplicants = results.filter((res) => res.body.ok);

      expect(successApplicants.length).toEqual(MAX_APPLICANTS);

      results.slice(MAX_APPLICANTS).forEach((res) => {
        expect(res.body.ok).toBeFalsy();
      });
    }, 30000);

    it('/lecture/count/:title (GET) - 특별 강의, 가능한 수강 신청 인원을 조회합니다.', async () => {
      const title = 'test';
      const res = await request(app.getHttpServer())
        .get(`/lecture/count/${title}`)
        .expect(200);
      expect(res.body.ok).toBeTruthy();
      expect(res.body.count).toEqual(expect.any(Number));
    });

    it('/lecture/:name (GET) - 유저가 수강할 특별 강의를 조회합니다.', async () => {
      const res = await request(app.getHttpServer())
        .get('/lecture/test')
        .expect(200);
      expect(res.body.ok).toBeTruthy();
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
