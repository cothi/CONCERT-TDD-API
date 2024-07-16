import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/modules/app.module';
import request from 'supertest';

describe('Enqueue Test (e2e)', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });
  const createUserRequest = (email: string = `user${Date.now()}@example.com`) =>
    request(app.getHttpServer()).post('/auth/register').send({ email });

  const createEnqueueRequest = (accessToken: string) =>
    request(app.getHttpServer())
      .post('/enqueue')
      .set('Authorization', `Bearer ${accessToken}`);
  const getQueueStatusRequest = (accessToken: string) =>
    request(app.getHttpServer())
      .get(`/enqueue`)
      .set('Authorization', `Bearer ${accessToken}`);

  it('다수의 유저의 대기열 등록을 정상적으로 처리해야 합니다. - /enqueue (POST)', async () => {
    const numberOfUsers = 50;

    const users = await Promise.all(
      Array(numberOfUsers)
        .fill(null)
        .map(async (_, index) => {
          const registerResponse = await createUserRequest(
            `user${index + 1}@example.com`,
          );
          expect(registerResponse.status).toBe(201);
          return {
            id: registerResponse.body.id,
            accessToken: registerResponse.body.accessToken,
          };
        }),
    );

    const enqueueResponses = await Promise.all(
      users.map((user) => createEnqueueRequest(user.accessToken)),
    );

    enqueueResponses.forEach((res, index) => {
      expect(res.status).toBe(201);
    });
  }, 30000);

  // 사용자 등록 및 대기열 등록 후 확인
  it('사용자 등록 및 대기열 등록 후 확인 - /enqueue (POST)', async () => {
    const registerResponse = await createUserRequest();
    expect(registerResponse.status).toBe(201);

    const enqueueResponse = await createEnqueueRequest(
      registerResponse.body.accessToken,
    );
    expect(enqueueResponse.status).toBe(201);

    const queueStatusResponse = await getQueueStatusRequest(
      registerResponse.body.accessToken,
    );
    expect(queueStatusResponse.status).toBe(200);
  });

  it('사용자 등록 후 대기열 등록 시 중복 등록 방지 - /enqueue (POST)', async () => {
    const registerResponse = await createUserRequest();
    expect(registerResponse.status).toBe(201);

    const enqueueResponse = await createEnqueueRequest(
      registerResponse.body.accessToken,
    );
    expect(enqueueResponse.status).toBe(201);

    const enqueueResponse2 = await createEnqueueRequest(
      registerResponse.body.accessToken,
    );
    expect(enqueueResponse2.status).toBe(409);
  });
  // 사용자 등록 및 대기열에 없으면 404 반환
  it('사용자 등록 및 대기열에 없으면 404 반환 - /enqueue (GET) ', async () => {
    const registerResponse = await createUserRequest();
    expect(registerResponse.status).toBe(201);

    const queueStatusResponse = await getQueueStatusRequest(
      registerResponse.body.accessToken,
    );
    expect(queueStatusResponse.status).toBe(404);
  });

  // 사용자 등록 없이 대기열 조회 시 401 반환
  it('사용자 등록 없이 대기열 조회 시 401 반환 - /enqueue (GET)', async () => {
    const queueStatusResponse = await getQueueStatusRequest('invalid-token');
    expect(queueStatusResponse.status).toBe(401);
  });
});
