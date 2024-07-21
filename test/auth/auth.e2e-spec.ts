import { Test, TestingModule } from '@nestjs/testing';
import { createApiRequests } from '../helpers/api-requests';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/modules/app.module';
describe('Auth Test (e2e)', () => {
  let app: INestApplication;
  let apiRequest: ReturnType<typeof createApiRequests>;
  const testContext: {
    testUserId?: string;
    accessToken?: string;
    email?: string;
    notLoginEmail?: string;
  } = {
    email: 'test@test.ai',
    notLoginEmail: 'notLogin@test.ai',
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
  });
  describe('회원가입 - /auth/register (POST)', () => {
    it('회원가입이 정상적으로 이루어져야 합니다. ', async () => {
      const registerResponse = await apiRequest.createUserRequest(
        testContext.email,
      );
      expect(registerResponse.status).toBe(201);
    });
    it('이미 가입된 이메일로 회원가입 시도 시 중복 방지 ', async () => {
      const registerResponse = await apiRequest.createUserRequest(
        testContext.email,
      );
      expect(registerResponse.status).toBe(406);
    });
    it('이메일 형식이 아닌 경우 회원가입 시도 시 에러 ', async () => {
      const registerResponse = await apiRequest.createUserRequest('test');
      expect(registerResponse.status).toBe(400);
    });
  });
  describe('로그인 - /auth/login (POST)', () => {
    it('로그인이 정상적으로 이루어져야 합니다.', async () => {
      const loginResponse = await apiRequest.loginRequest(testContext.email);
      expect(loginResponse.status).toBe(200);
    });
    it('가입되지 않은 이메일로 로그인 시도 시 에러 ', async () => {
      const loginResponse = await apiRequest.loginRequest(
        testContext.notLoginEmail,
      );
      expect(loginResponse.status).toBe(404);
    });
    it('이메일 형식이 아닌 경우 로그인 시도 시 에러 ', async () => {
      const loginResponse = await apiRequest.loginRequest('test');
      expect(loginResponse.status).toBe(400);
    });
    it('로그인 시 토큰이 발급되어야 합니다. ', async () => {
      const loginResponse = await apiRequest.loginRequest(testContext.email);
      expect(loginResponse.body.accessToken).toBeDefined();
    });
  });
  describe('토큰 갱신 - /auth/refresh (POST) ', () => {
    it('토큰 갱신이 정상적으로 이루어져야 합니다. ', async () => {
      const loginResponse = await apiRequest.loginRequest(testContext.email);
      expect(loginResponse.status).toBe(200);
    });
    it('리프레시 토큰이 없는 경우 토큰 갱신 시도 시 에러', async () => {
      const refreshTokenResponse = await apiRequest.tokenRefreshRequest('');
      expect(refreshTokenResponse.status).toBe(400);
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
