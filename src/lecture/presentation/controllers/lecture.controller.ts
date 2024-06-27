import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApplyLectureRequestDto } from '../dto/request/apply-lecture.request.dto';
import { ApplyLectureResponseDto } from '../dto/response/apply-lecture.response.dto';
import { LectureServiceSymbol } from 'src/lecture/application/services/lecture.service.impl';
import { LectureService } from 'src/lecture/application/services/lecture.service';
import { GetLectures } from '../dto/response/get-lectures.response.dto';
import { GetLectureCountResponseDto } from '../dto/response/get-lecture-count.response.dto';
import { GetApplicationsByNameResponseDto } from '../dto/response/get-applications-by-name.response.dto';
@Controller('lecture')
export class SpecialLectureController {
  constructor(
    @Inject(LectureServiceSymbol)
    private readonly lectureService: LectureService,
  ) {}

  // TODO: 특강 목록 조회 API
  @Get('gets')
  async getAllLectures(): Promise<GetLectures> {
    return await this.lectureService.getAllLectures();
  }

  @Get(':name')
  async getApplicationsByName(
    @Param('name') name: string,
  ): Promise<GetApplicationsByNameResponseDto> {
    return await this.lectureService.getApplicationsByName(name);
  }

  // TODO: 특강에 성공한 지원자 조회

  // TODO: 특강 몇명 남았는지 조회
  @Get('count/:title')
  async getLectureCount(
    @Param('title') title: string,
  ): Promise<GetLectureCountResponseDto> {
    return await this.lectureService.getLectureCount(title);
  }

  @Post('apply')
  async applyLecture(
    @Body() data: ApplyLectureRequestDto,
  ): Promise<ApplyLectureResponseDto> {
    return await this.lectureService.applyLecture(data);
  }
}
