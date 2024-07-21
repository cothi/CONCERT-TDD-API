import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/modules/app.module';
import { createApiRequests } from '../helpers/api-requests';

describe('Point Test (e2e)', () => {
  let app: INestApplication;
  let apiRequest: ReturnType<typeof createApiRequests>;

  const testContext: {
    testUserId?: string;
    accessToken?: string;
    email?: string;
    notRegisteredEmail?: string;
  } = {
    email: 'test@test.ai',
    notRegisteredEmail: 'not@register.ai',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
    apiRequest = createApiRequests(app);

    const loginResponse = await apiRequest.createUserRequest(testContext.email);
    testContext.accessToken = loginResponse.body.accessToken;
  });

  describe('포인트 조회 - /points (GET)', () => {
    it('포인트 조회가 정상적으로 이루어져야 합니다.', async () => {
      const response = await apiRequest.getPointsRequest(
        testContext.accessToken,
      );
      expect(response.status).toBe(200);
    });

    it('가입되지 않은 이메일로 포인트 조회 시도 시 에러 ', async () => {
      const response = await apiRequest.getPointsRequest('');
      expect(response.status).toBe(401);
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('포인트 충전 - /points/charge (PATCH)', () => {
    it('포인트 충전이 정상적으로 이루어져야 합니다.', async () => {
      const response = await apiRequest.chargePointRequest(
        testContext.accessToken,
        100,
      );
      expect(response.body).toEqual({
        amount: '100.00',
        chargeAmount: '100.00',
      });
      expect(response.status).toBe(200);
    });

    it('가입되지 않은 이메일로 포인트 충전 시도 시 에러 ', async () => {
      const response = await apiRequest.chargePointRequest('', 100);
      expect(response.status).toBe(401);
    });
  });
});
