import { Inject, Injectable } from '@nestjs/common';
import { CreateLectureDto, LectureOutputDto } from '../dto/create-lecture.dto';
import { UpdateLectureDto } from '../dto/update-lecture.dto';
import { LectureService } from './lecture.serivce';
import { LectrueRepositories } from '../repositories/lecture.repositories';
import { LectureRepositoriesSymbol } from '../repositories/lecture.repositories.impl';
import { title } from 'process';

export const LectureServiceSymbol = Symbol('LectureService');
@Injectable()
export class LectureServiceImpl implements LectureService {
  constructor(
    @Inject(LectureRepositoriesSymbol)
    private readonly lectureRepositories: LectrueRepositories,
  ) {}
  async createLecture(data: CreateLectureDto): Promise<LectureOutputDto> {
    try {
      const lecture = await this.lectureRepositories.createLecture(data);
      return {
        ok: true,
        message: '강의가 생성되었습니다',
        lectures: lecture,
      };
    } catch (e) {
      return {
        ok: false,
        message: '강의 생성에 실패했습니다',
      };
    }
  }

  async getLecture(ttile: string): Promise<LectureOutputDto> {
    try {
      if (!title) {
        return {
          ok: false,
          message: '강의 제목을 입력해주세요',
        };
      }
      const lecture = await this.lectureRepositories.getLecture(ttile);
      return {
        lectures: lecture,
        ok: true,
        message: '강의가 조회되었습니다',
      };
    } catch (e) {
      return {
        ok: false,
        message: '강의 조회에 실패했습니다',
      };
    }
  }

  async getAllLectures(): Promise<LectureOutputDto> {
    try {
      const lectrues = await this.lectureRepositories.getAllLectures();
      return {
        lectures: lectrues,
        ok: true,
        message: '모든 강의가 조회되었습니다',
      };
    } catch (e) {
      return {
        ok: false,
        message: '모든 강의 조회에 실패했습니다',
      };
    }
  }

  async cancelLecture(title: string): Promise<LectureOutputDto> {
    return {
      ok: true,
      message: '강의가 취소되었습니다',
    };
  }
}
