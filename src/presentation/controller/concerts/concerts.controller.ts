import { GetConcertDatesUseCase } from './../../../application/concerts/use-cases/get-concert-dates.use-case';
import { GetConcertsUseCase } from './../../../application/concerts/use-cases/get-conserts.use-case';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateConcertDateUseCase } from 'src/application/concerts/use-cases/create-concert-date.use-case';
import { CreateConcertUseCase } from 'src/application/concerts/use-cases/create-concert.use-case';
import { CreateSeatUseCase } from 'src/application/concerts/use-cases/create-seat.use-case';
import { GetUserReservationsUseCase } from 'src/application/concerts/use-cases/get-user-reservation.use-case';
import { ReserveSeatUseCase } from 'src/application/concerts/use-cases/reserve-seat.user-case';
import { Payload } from 'src/common/decorators/token.decorator';
import { EligibleForReservationGuard } from 'src/common/guards/eligible-for-reservation.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { JwtPayload } from 'src/common/interfaces/jwt-token.interface';
import { CreateConcertDateDto } from 'src/presentation/dto/concerts/dto/request/create-concert-date.dto';
import { CreateConcertDto } from 'src/presentation/dto/concerts/dto/request/create-concert.dto';
import { CreateSeatDto } from 'src/presentation/dto/concerts/dto/request/create-seat.dto';
import { ReserveSeatDto } from 'src/presentation/dto/concerts/dto/request/reserve-seat.dto';
import { ConcertDateResponseDto } from 'src/presentation/dto/concerts/dto/response/concert-date.response.dto';
import { ConcertResponseDto } from 'src/presentation/dto/concerts/dto/response/concert.response.dto';
import { CreateSeatResponseDto } from 'src/presentation/dto/concerts/dto/response/create-seat.response.dto';
import { ReserveSeatResponseDto } from 'src/presentation/dto/concerts/dto/response/reserve-seat.response.dto';
import { GetUserReservationsResponseDto } from 'src/presentation/dto/points/response/get-user-reservations.dto';
import { GetConcertSeatsUseCase } from './../../../application/concerts/use-cases/get-concert-seats.use-case';
import { GetSeatsByConcertIdResponseDto } from 'src/presentation/dto/concerts/dto/response/get-seats-by-concertid.dto';
import { GetConcertsResponseDto } from 'src/presentation/dto/concerts/dto/response/get-concerts.response.dto';
import { GetSeatsByConcertIdCommand } from 'src/application/concerts/command/get-seats-by-concertId.command';
/**
 * 콘서트 관련 요청을 처리하는 컨트롤러
 * 콘서트 대기열 입장 및 대기열 상태 조회 기능을 제공합니다.
 */

@ApiTags('콘서트')
@Controller('concerts')
export class ConcertsController {
  constructor(
    private readonly createConcertDateUseCase: CreateConcertDateUseCase,
    private readonly createConcertUseCase: CreateConcertUseCase,
    private readonly createSeatUseCase: CreateSeatUseCase,
    private readonly reserveSeatUseCase: ReserveSeatUseCase,
    private readonly getUserReservationsUseCase: GetUserReservationsUseCase,
    private readonly getConcertSeatsUseCase: GetConcertSeatsUseCase,
    private readonly getConcertsUseCase: GetConcertsUseCase,
    private readonly getConcertDatesUseCase: GetConcertDatesUseCase,
  ) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '콘서트 생성',
    description: '새로운 콘서트를 생성합니다.',
  })
  @ApiBody({ type: CreateConcertDto })
  @ApiResponse({
    status: 201,
    description: '생성된 콘서트 정보',
    type: ConcertResponseDto,
  })
  async createConcert(
    @Body() createConcertDto: CreateConcertDto,
  ): Promise<ConcertResponseDto> {
    return this.createConcertUseCase.execute({ name: createConcertDto.name });
  }

  @Get()
  @ApiOperation({
    summary: '콘서트 조회',
    description: '모든 콘서트를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '콘서트 목록',
    type: [GetConcertsResponseDto],
  })
  async getConcerts(): Promise<GetConcertsResponseDto> {
    return this.getConcertsUseCase.execute();
  }

  @Post(':concertId/dates')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '콘서트 날짜 생성',
    description: '특정 콘서트에 새로운 날짜를 추가합니다.',
  })
  @ApiBody({ type: CreateConcertDateDto })
  @ApiResponse({
    status: 201,
    description: '생성된 콘서트 날짜 정보',
    type: ConcertDateResponseDto,
  })
  async createConcertDate(
    @Param('concertId') concertId: string,
    @Body() createConcertDateDto: CreateConcertDateDto,
  ): Promise<ConcertDateResponseDto> {
    return this.createConcertDateUseCase.execute({
      concertId,
      date: createConcertDateDto.date,
      totalSeat: createConcertDateDto.totalSeat,
    });
  }

  @Get(':concertId/dates')
  @ApiOperation({
    summary: '콘서트 날짜 조회',
    description: '모든 콘서트 날짜를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '콘서트 날짜 목록',
    type: [ConcertDateResponseDto],
  })
  async getConcertDates(
    @Param('concertId') concertId: string,
  ): Promise<ConcertDateResponseDto[]> {
    return this.getConcertDatesUseCase.execute({ concertId: concertId });
  }

  @Post('dates/:concertDateId/seats')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '콘서트 날짜 좌석 생성',
    description: '특정 콘서트 날짜에 새로운 좌석을 생성합니다.',
  })
  @ApiBody({ type: CreateSeatDto })
  @ApiResponse({
    status: 201,
    description: '생성된 좌석 정보',
    type: CreateSeatResponseDto,
  })
  async createSeat(
    @Param('concertDateId') concertDateId: string,
    @Body() createSeatDto: CreateSeatDto,
  ): Promise<CreateSeatResponseDto> {
    return this.createSeatUseCase.execute({
      concertDateId,
      seatNumber: createSeatDto.seatNumber,
      price: createSeatDto.price,
    });
  }

  @Get('dates/:concertDateId/seats')
  @ApiOperation({
    summary: '콘서트 날짜 좌석 조회',
    description: '특정 콘서트 날짜의 모든 좌석을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '콘서트 날짜 좌석 목록',
  })
  @UseGuards(JwtAuthGuard)
  async getSeatsByConcertDateId(
    @Param('concertDateId') concertDateId: string,
  ): Promise<GetSeatsByConcertIdResponseDto> {
    const command: GetSeatsByConcertIdCommand = { concertDateId };
    return this.getConcertSeatsUseCase.execute(command);
  }

  @Post('seats/reserve')
  @UseGuards(JwtAuthGuard, EligibleForReservationGuard)
  @ApiOperation({
    summary: '콘서트 좌석 예약',
    description: '특정 좌석을 예약합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '예약된 좌석 정보',
    type: ReserveSeatResponseDto,
  })
  async reserveSeat(
    @Body() reserveSeatDto: ReserveSeatDto,
    @Payload() payload: JwtPayload,
  ): Promise<ReserveSeatResponseDto> {
    return this.reserveSeatUseCase.execute({
      seatId: reserveSeatDto.seatId,
      userId: payload.userId,
    });
  }

  @Get('seats/reserve')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '사용자 예약 조회',
    description: '사용자의 모든 예약 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 예약 목록',
    type: [GetUserReservationsResponseDto],
  })
  async getUserReservations(
    @Payload() payload: JwtPayload,
  ): Promise<GetUserReservationsResponseDto> {
    return this.getUserReservationsUseCase.execute({ userId: payload.userId });
  }
}
