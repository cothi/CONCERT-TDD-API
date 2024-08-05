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
    it('다수의 유저(500명)의 대기열 등록을 정상적으로 처리해야 합니다. (POST)', async () => {
      const numberOfUsers = 500;
      const accessTokenList: string[] = [];
      for (let i = 0; i < numberOfUsers; i++) {
        const email = `${randomUUID()}@gmail.ai`;
        const registerResponse = await apiRequests.createUserRequest(email);
        expect(registerResponse.body.statusCode).toBe(201);
        accessTokenList.push(registerResponse.body.data.accessToken);
      }
      // promise all로 대기열 등록
      const enqueueResponseList = await Promise.all(
        accessTokenList.map((accessToken) =>
          apiRequests.createEnqueueRequest(accessToken),
        ),
      );
      enqueueResponseList.forEach((enqueueResponse) => {
        expect(enqueueResponse.status).toBe(201);
      });
    }, 50000);
    it('사용자 등록 후 대기열 등록 시 중복 등록 방지 (POST)', async () => {
      const registerResponse = await apiRequests.createUserRequest(
        `${randomUUID()}@gmail.ai`,
      );
      const status = registerResponse.body.statusCode;
      expect(status).toBe(201);

      const enqueueResponse = await apiRequests.createEnqueueRequest(
        registerResponse.body.data.accessToken,
      );
      console.log(enqueueResponse.body);
      const status2 = enqueueResponse.body.statusCode;
      expect(status2).toBe(201);

      const enqueueResponse2 = await apiRequests.createEnqueueRequest(
        registerResponse.body.data.accessToken,
      );
      const status3 = enqueueResponse2.body.statusCode;
      expect(status3).toBe(409);
    });
  });

  describe('대기열 조회 - /enqueue', () => {
    // 사용자 등록 및 대기열 등록 후 확인
    it('사용자 등록 및 대기열 등록 후 조회 (POST)', async () => {
      const email = `${randomUUID()}@gmail.ai`;
      const registerResponse = await apiRequests.createUserRequest(email);
      const status = registerResponse.body.statusCode;
      expect(status).toBe(201);

      const enqueueResponse = await apiRequests.createEnqueueRequest(
        registerResponse.body.data.accessToken,
      );
      const status2 = enqueueResponse.body.statusCode;
      expect(status2).toBe(201);

      const queueStatusResponse = await apiRequests.getQueueStatusRequest(
        registerResponse.body.data.accessToken,
      );
      const status3 = queueStatusResponse.body.statusCode;
      expect(status3).toBe(200);
    });

    // // 사용자 등록 및 대기열에 없으면 404 반환
    // it('사용자 등록 및 대기열에 없으면 조회 시에는 404 반환  (GET) ', async () => {
    //   const registerResponse = await apiRequests.createUserRequest('1@g.g');
    //   const status = registerResponse.body.data.statusCode;
    //   expect(status).toBe(201);

    //   const queueStatusResponse = await apiRequests.getQueueStatusRequest(
    //     registerResponse.body.data.accessToken,
    //   );
    //   const status2 = queueStatusResponse.body.statusCode;
    //   expect(status2).toBe(404);
    // });

    // 사용자 등록 없이 대기열 조회 시 401 반환
    it('사용자 등록 없이 대기열 조회 시 401 반환  (GET)', async () => {
      const queueStatusResponse =
        await apiRequests.getQueueStatusRequest('invalid-token');
      const status = queueStatusResponse.body.statusCode;
      expect(status).toBe(401);
    });
  });
});
