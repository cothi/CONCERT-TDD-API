import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { AppModule } from 'src/modules/app.module';
import { createApiRequests } from '../helpers/api-requests';

describe('Enqueue Test (e2e)', () => {
  let app: INestApplication;
  let apiRequests: ReturnType<typeof createApiRequests>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    apiRequests = createApiRequests(app);
  });
  afterAll(async () => {
    await app.close();
  });

  describe('대기열 등록 - /enqueue', () => {
    it('다수의 유저(50명)의 대기열 등록을 정상적으로 처리해야 합니다. (POST)', async () => {
      const numberOfUsers = 50;

      const users = await Promise.all(
        Array(numberOfUsers)
          .fill(null)
          .map(async (_, index) => {
            const registerResponse = await apiRequests.createUserRequest(
              `user${randomUUID()}@example.com`,
            );
            expect(registerResponse.status).toBe(201);
            return {
              id: registerResponse.body.id,
              accessToken: registerResponse.body.accessToken,
            };
          }),
      );

      const enqueueResponses = await Promise.all(
        users.map((user) => apiRequests.createEnqueueRequest(user.accessToken)),
      );

      enqueueResponses.forEach((res, index) => {
        expect(res.status).toBe(201);
      });
    }, 30000);
    it('사용자 등록 후 대기열 등록 시 중복 등록 방지 (POST)', async () => {
      const registerResponse = await apiRequests.createUserRequest();
      expect(registerResponse.status).toBe(201);

      const enqueueResponse = await apiRequests.createEnqueueRequest(
        registerResponse.body.accessToken,
      );
      expect(enqueueResponse.status).toBe(201);

      const enqueueResponse2 = await apiRequests.createEnqueueRequest(
        registerResponse.body.accessToken,
      );
      expect(enqueueResponse2.status).toBe(409);
    });
  });

  describe('대기열 조회 - /enqueue', () => {
    // 사용자 등록 및 대기열 등록 후 확인
    it('사용자 등록 및 대기열 등록 후 조회 (POST)', async () => {
      const registerResponse = await apiRequests.createUserRequest();
      expect(registerResponse.status).toBe(201);

      const enqueueResponse = await apiRequests.createEnqueueRequest(
        registerResponse.body.accessToken,
      );
      expect(enqueueResponse.status).toBe(201);

      const queueStatusResponse = await apiRequests.getQueueStatusRequest(
        registerResponse.body.accessToken,
      );
      expect(queueStatusResponse.status).toBe(200);
    });

    // 사용자 등록 및 대기열에 없으면 404 반환
    it('사용자 등록 및 대기열에 없으면 조회 시에는 404 반환  (GET) ', async () => {
      const registerResponse = await apiRequests.createUserRequest();
      expect(registerResponse.status).toBe(201);

      const queueStatusResponse = await apiRequests.getQueueStatusRequest(
        registerResponse.body.accessToken,
      );
      expect(queueStatusResponse.status).toBe(404);
    });

    // 사용자 등록 없이 대기열 조회 시 401 반환
    it('사용자 등록 없이 대기열 조회 시 401 반환  (GET)', async () => {
      const queueStatusResponse =
        await apiRequests.getQueueStatusRequest('invalid-token');
      expect(queueStatusResponse.status).toBe(401);
    });
  });
});
