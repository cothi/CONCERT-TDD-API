import { Injectable } from '@nestjs/common';
import { SpecialLectureService } from './special-lecture.service';
import {
  ApplySpecialLectureDto,
  ApplySpecialLectureOutputDto,
} from '../dto/create-special-lecture.dto';

export const SpecialLectureServiceSymbol = Symbol('SpecialLectureService');
@Injectable()
export class SpecialLectureServiceImpl implements SpecialLectureService {
  async applySpecialLecture(
    data: ApplySpecialLectureDto,
  ): Promise<ApplySpecialLectureOutputDto> {
    return {
      ok: true,
      message: '특강 신청이 완료되었습니다',
    };
  }
}
