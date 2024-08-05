import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/infrastructure/database/prisma/prisma.service';
import { AppModule } from 'src/modules/app.module';
import { createApiRequests } from '../helpers/api-requests';
import { RedisService } from 'src/infrastructure/database/redis/redis.service';

describe('콘서트', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let redisService: RedisService;
  let apiRequest: ReturnType<typeof createApiRequests>;

  const seatTotal = 100;
  const date = new Date();
  const testContext: {
    testUserId?: string;
    accessToken?: string;
    email?: string;
  } = {};

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

    prismaService = app.get<PrismaService>(PrismaService);
    redisService = app.get<RedisService>(RedisService);
    await app.init();
    apiRequest = createApiRequests(app);

    const testUser = await prismaService.user.create({
      data: {
        email: `user${randomUUID()}@example.com`,
      },
    });

    testContext.testUserId = testUser.id;
    testContext.email = testUser.email;
    await redisService.grantReservationPermissions([testUser.id]);
    const loginResponse = await apiRequest.loginRequest(testContext.email);
    testContext.accessToken = loginResponse.body.data.accessToken;
  });

  afterAll(async () => {
    await prismaService.deleteTableData();
    await app.close();
  });

  describe('콘서트 등록 - /concerts (POST)', () => {
    it('콘서트 등록이 정상적으로 이루어져야 합니다.', async () => {
      const concertName = 'test concert';

      const concertResponse = await apiRequest.createConcertRequest(
        testContext.accessToken,
        concertName,
      );
      const status = concertResponse.body.statusCode;
      expect(status).toBe(201);
    });

    it('콘서트 등록 시 콘서트 이름이 없으면 에러가 발생해야 합니다.', async () => {
      const concertResponse = await apiRequest.createConcertRequest(
        testContext.accessToken,
        '',
      );
      const status = concertResponse.body.statusCode;
      expect(status).toBe(400);
    });

    it('콘서트 등록 시 토큰이 없으면 에러가 발생해야 합니다.', async () => {
      const concertResponse = await apiRequest.createConcertRequest(
        '',
        'test concert',
      );
      const status = concertResponse.body.statusCode;
      expect(status).toBe(401);
    });
  });

  describe('콘서트 날짜 등록 - /concerts/:concertId/dates (POST)', () => {
    it('콘서트 날짜 등록이 정상적으로 이루어져야 합니다.', async () => {
      const concertName = 'test concert2';
      const concertResponse = await apiRequest.createConcertRequest(
        testContext.accessToken,
        concertName,
      );
      expect(concertResponse.body.statusCode).toBe(201);

      const concertDateResponse = await apiRequest.createConcertDateRequest(
        date,
        concertResponse.body.data.concertId,
        seatTotal,
        testContext.accessToken,
      );
      expect(concertDateResponse.body.statusCode).toBe(201);
    });

    it('콘서트 날짜 등록 시 콘서트 아이디가 없으면 에러가 발생해야 합니다.', async () => {
      const concertDateResponse = await apiRequest.createConcertDateRequest(
        date,
        '',
        seatTotal,
        testContext.accessToken,
      );
      expect(concertDateResponse.body.statusCode).toBe(404);
    });

    it('콘서트 날짜 등록 시 토큰이 없으면 에러가 발생해야 합니다.', async () => {
      const concertName = 'test concert3';
      const concertResponse = await apiRequest.createConcertRequest(
        testContext.accessToken,
        concertName,
      );
      expect(concertResponse.status).toBe(201);

      const concertDateResponse = await apiRequest.createConcertDateRequest(
        date,
        concertResponse.body.data.concertId,
        seatTotal,
        '',
      );
      expect(concertDateResponse.body.statusCode).toBe(401);
    });

    it('콘서트가 존재하지 않으면 에러가 발생해야 합니다.', async () => {
      const concertDateResponse = await apiRequest.createConcertDateRequest(
        date,
        randomUUID(),
        seatTotal,
        testContext.accessToken,
      );
      expect(concertDateResponse.body.statusCode).toBe(404);
    });

    it('콘서트 날짜 등록 시 총 좌석이 없으면 에러가 발생해야 합니다.', async () => {
      const concertName = 'test concert4';
      const concertResponse = await apiRequest.createConcertRequest(
        testContext.accessToken,
        concertName,
      );
      expect(concertResponse.status).toBe(201);

      const concertDateResponse = await apiRequest.createConcertDateRequest(
        date,
        concertResponse.body.data.concertId,
        0,
        testContext.accessToken,
      );
      expect(concertDateResponse.body.statusCode).toBe(400);
    });

    it('콘서트 날짜 등록 시 날짜가 없으면 에러가 발생해야 합니다.', async () => {
      const concertName = 'test concert5';
      const concertResponse = await apiRequest.createConcertRequest(
        testContext.accessToken,
        concertName,
      );
      expect(concertResponse.body.statusCode).toBe(201);

      const concertDateResponse = await apiRequest.createConcertDateRequest(
        null,
        concertResponse.body.data.concertId,
        seatTotal,
        testContext.accessToken,
      );
      const status = concertDateResponse.body.statusCode;
      expect(status).toBe(400);
    });
  });

  describe('콘서트 날짜 좌석 등록 - /concerts/dates/:concertDateId/seats (POST)', () => {
    it('콘서트 날짜 좌석 등록이 정상적으로 이루어져야 합니다.', async () => {
      const concertName = 'test concert6';
      const concertResponse = await apiRequest.createConcertRequest(
        testContext.accessToken,
        concertName,
      );
      expect(concertResponse.status).toBe(201);

      const concertDateResponse = await apiRequest.createConcertDateRequest(
        date,
        concertResponse.body.data.concertId,
        seatTotal,
        testContext.accessToken,
      );
      const status = concertDateResponse.body.statusCode;
      expect(status).toBe(201);

      const concertDateSeatResponse =
        await apiRequest.createConcertDateSeatRequest(
          testContext.accessToken,
          concertDateResponse.body.data.concertDateId,
          1,
          1,
        );
      const status2 = concertDateSeatResponse.body.statusCode;
      expect(status2).toBe(201);
    });

    it('콘서트 날짜 좌석 등록 시 콘서트 날짜 아이디가 없으면 에러가 발생해야 합니다.', async () => {
      const concertDateSeatResponse =
        await apiRequest.createConcertDateSeatRequest(
          testContext.accessToken,
          '',
          1,
          1,
        );
      const status = concertDateSeatResponse.body.statusCode;
      expect(status).toBe(404);
    });

    it('콘서트 날짜 좌석 등록 시 토큰이 없으면 에러가 발생해야 합니다.', async () => {
      const concertName = 'test concert7';
      const concertResponse = await apiRequest.createConcertRequest(
        testContext.accessToken,
        concertName,
      );
      const status = concertResponse.body.statusCode;
      expect(status).toBe(201);

      const concertDateResponse = await apiRequest.createConcertDateRequest(
        date,
        concertResponse.body.data.concertId,
        seatTotal,
        testContext.accessToken,
      );
      const status2 = concertDateResponse.body.statusCode;
      expect(status2).toBe(201);

      const concertDateSeatResponse =
        await apiRequest.createConcertDateSeatRequest(
          '',
          concertDateResponse.body.data.concertDateId,
          1,
          1,
        );
      const status3 = concertDateSeatResponse.body.statusCode;
      expect(status3).toBe(401);
    });

    it('콘서트 날짜 좌석 등록 시 좌석 번호가 없으면 에러가 발생해야 합니다.', async () => {
      const concertName = 'test concert8';
      const concertResponse = await apiRequest.createConcertRequest(
        testContext.accessToken,
        concertName,
      );
      const status = concertResponse.body.statusCode;
      expect(status).toBe(201);

      const concertDateResponse = await apiRequest.createConcertDateRequest(
        date,
        concertResponse.body.data.concertId,
        seatTotal,
        testContext.accessToken,
      );
      const status2 = concertDateResponse.body.statusCode;
      expect(status2).toBe(201);

      const concertDateSeatResponse =
        await apiRequest.createConcertDateSeatRequest(
          testContext.accessToken,
          concertDateResponse.body.data.concertDateId,
          null,
          1,
        );
      const status3 = concertDateSeatResponse.body.statusCode;
      expect(status3).toBe(400);
    });
    it('콘서트 날짜 좌석 등록 시 가격이 없으면 에러가 발생해야 합니다.', async () => {
      const concertName = 'test concert9';
      const concertResponse = await apiRequest.createConcertRequest(
        testContext.accessToken,
        concertName,
      );
      const status = concertResponse.body.statusCode;
      expect(status).toBe(201);

      const concertDateResponse = await apiRequest.createConcertDateRequest(
        date,
        concertResponse.body.data.concertId,
        seatTotal,
        testContext.accessToken,
      );
      const status2 = concertDateResponse.body.statusCode;
      expect(status2).toBe(201);

      const concertDateSeatResponse =
        await apiRequest.createConcertDateSeatRequest(
          testContext.accessToken,
          concertDateResponse.body.data.concertDateId,
          1,
          null,
        );
      const status3 = concertDateSeatResponse.body.statusCode;
      expect(status3).toBe(400);
    });

    it('콘서트 날짜 좌석 등록 시 좌석 번호가 중복되면 에러가 발생해야 합니다.', async () => {
      const concertName = 'test concert10';
      const concertResponse = await apiRequest.createConcertRequest(
        testContext.accessToken,
        concertName,
      );
      const status = concertResponse.body.statusCode;
      expect(status).toBe(201);

      const concertDateResponse = await apiRequest.createConcertDateRequest(
        date,
        concertResponse.body.data.concertId,
        seatTotal,
        testContext.accessToken,
      );
      const status2 = concertDateResponse.body.statusCode;
      expect(status2).toBe(201);

      const concertDateSeatResponse =
        await apiRequest.createConcertDateSeatRequest(
          testContext.accessToken,
          concertDateResponse.body.data.concertDateId,
          1,
          1,
        );
      const status3 = concertDateSeatResponse.body.statusCode;
      expect(status3).toBe(201);

      const concertDateSeatResponse2 =
        await apiRequest.createConcertDateSeatRequest(
          testContext.accessToken,
          concertDateResponse.body.data.concertDateId,
          1,
          1,
        );
      const status4 = concertDateSeatResponse2.body.statusCode;
      expect(status4).toBe(409);
    });
    it('콘서트 날짜 좌석 등록 시 좌석 번호가 0보다 작으면 에러가 발생해야 합니다.', async () => {
      const concertName = 'test concert11';
      const concertResponse = await apiRequest.createConcertRequest(
        testContext.accessToken,
        concertName,
      );

      const status = concertResponse.body.statusCode;
      expect(status).toBe(201);

      const concertDateResponse = await apiRequest.createConcertDateRequest(
        date,
        concertResponse.body.data.concertId,
        seatTotal,
        testContext.accessToken,
      );
      const status2 = concertDateResponse.body.statusCode;
      expect(status2).toBe(201);

      const concertDateSeatResponse =
        await apiRequest.createConcertDateSeatRequest(
          testContext.accessToken,
          concertDateResponse.body.data.concertDateId,
          -1,
          1,
        );
      const status3 = concertDateSeatResponse.body.statusCode;
      expect(status3).toBe(400);
    });

    it('콘서트 날짜 좌석 등록 시 가격이 0보다 작으면 에러가 발생해야 합니다.', async () => {
      const concertName = 'test concert12';
      const concertResponse = await apiRequest.createConcertRequest(
        testContext.accessToken,
        concertName,
      );
      const status = concertResponse.body.statusCode;
      expect(status).toBe(201);

      const concertDateResponse = await apiRequest.createConcertDateRequest(
        date,
        concertResponse.body.data.concertId,
        seatTotal,
        testContext.accessToken,
      );
      const status2 = concertDateResponse.body.statusCode;
      expect(status2).toBe(201);

      const concertDateSeatResponse =
        await apiRequest.createConcertDateSeatRequest(
          testContext.accessToken,
          concertDateResponse.body.data.concertDateId,
          1,
          -1,
        );
      const status3 = concertDateSeatResponse.body.statusCode;
      expect(status3).toBe(400);
    });
  });

  describe('사용자 좌석 예약 - /concerts/seats/reserve (POST)', () => {
    it('사용자 좌석 예약이 정상적으로 이루어져야 합니다.', async () => {
      const concertName = 'test concert13';
      const concertResponse = await apiRequest.createConcertRequest(
        testContext.accessToken,
        concertName,
      );

      const concertDateResponse = await apiRequest.createConcertDateRequest(
        date,
        concertResponse.body.data.concertId,
        seatTotal,
        testContext.accessToken,
      );
      const status = concertDateResponse.body.statusCode;
      expect(status).toBe(201);

      const concertDateSeatResponse =
        await apiRequest.createConcertDateSeatRequest(
          testContext.accessToken,
          concertDateResponse.body.data.concertDateId,
          1,
          1,
        );

      const status2 = concertDateSeatResponse.body.statusCode;
      expect(status2).toBe(201);

      const getSeatsResponse = await apiRequest.getConcertSeatsRequest(
        concertDateResponse.body.data.concertDateId,
        testContext.accessToken,
      );

      const seatId = getSeatsResponse.body.data.seats[0].seatId;
      const reserveResponse = await apiRequest.reserveSeatRequest(
        testContext.accessToken,
        seatId,
      );
      const status3 = reserveResponse.body.statusCode;
      expect(status3).toBe(201);
    });
  });
});
