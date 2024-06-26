import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApplyLectureRequestDto } from '../dto/request/apply-lecture.request.dto';
import { ApplyLectureResponseDto } from '../dto/response/apply-lecture.output.dto';
import { LectureServiceSymbol } from 'src/lecture/application/services/lecture.service.impl';
import { LectureService } from 'src/lecture/application/services/lecture.service';
@Controller('lecture')
export class SpecialLectureController {
  constructor(
    @Inject(LectureServiceSymbol)
    private readonly lectureService: LectureService,
  ) {}

  @Post('apply')
  async applySpecialLecture(
    @Body() data: ApplyLectureRequestDto,
  ): Promise<ApplyLectureResponseDto> {
    return await this.lectureService.applySpecialLecture(data);
  }
}
