import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateConcertDateUseCase } from 'src/application/concerts/use-cases/create-concert-date.use-case';
import { CreateConcertUseCase } from 'src/application/concerts/use-cases/create-concert.use-case';
import { CreateSeatUseCase } from 'src/application/concerts/use-cases/create-seat.use-case';
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
    return this.createConcertUseCase.execute(createConcertDto);
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

  // @Get('dates')
  // @ApiOperation({
  //   summary: '콘서트 날짜 조회',
  //   description: '모든 콘서트 날짜를 조회합니다.',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: '콘서트 날짜 목록',
  //   type: [ConcertDateResponseDto],
  // })
  // async getConcertDates(): Promise<ConcertDateResponseDto[]> {
  //   return this.getConcertDatesUseCase.execute();
  // }

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
}
