import { Injectable } from '@nestjs/common';
import { CreateLectureDto, LectureOutputDto } from '../dto/create-lecture.dto';
import { UpdateLectureDto } from '../dto/update-lecture.dto';

export const LectureServiceSymbol = Symbol('LectureService');
@Injectable()
export class LectureServiceImpl {
  async createLecture(data: CreateLectureDto): Promise<LectureOutputDto> {
    return {
      ok: true,
      message: '강의가 생성되었습니다',
    };
  }

  async getLecture(data: string): Promise<LectureOutputDto> {
    return {
      ok: true,
      message: '강의가 조회되었습니다',
    };
  }

  async getAllLectures(): Promise<LectureOutputDto> {
    return {
      ok: true,
      message: '모든 강의가 조회되었습니다',
    };
  }
}
