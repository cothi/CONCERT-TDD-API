import { AdminLectureRepositories } from './../../domain/repositories/admin-lecture.repositories';
import { Inject, Injectable } from '@nestjs/common';
import { AdminLectureService } from './admin.service';
import { LectureDto } from '../dto/create-lecture.dto';
import { AdminLectureResponseDto } from 'src/admin/presentation/dto/response/admin-lecture.response.dto';
import { AdminLectureRepositoriesSymbol } from 'src/admin/infrastructure/persistence/repositories/admin-lecture.repositories.impl';

export const AdminLectureServiceSymbol = Symbol('AdminLectureService');
@Injectable()
export class AdminLectureServiceImpl implements AdminLectureService {
  constructor(
    @Inject(AdminLectureRepositoriesSymbol)
    private readonly lectureRepositories: AdminLectureRepositories,
  ) {}
  async createLecture(data: LectureDto): Promise<AdminLectureResponseDto> {
    try {
      if (!data.title) {
        return {
          ok: false,
          message: '강의 제목을 입력해주세요',
        };
      }
      if (!data.maxApplicants) {
        return {
          ok: false,
          message: '최대 신청자 수를 입력해주세요',
        };
      }
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

  async getLecture(title: string): Promise<AdminLectureResponseDto> {
    try {
      if (!title) {
        return {
          ok: false,
          message: '강의 제목을 입력해주세요',
        };
      }
      const lecture = await this.lectureRepositories.getLecture(title);
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

  async getAllLectures(): Promise<AdminLectureResponseDto> {
    try {
      const lectures = await this.lectureRepositories.getAllLectures();
      return {
        lectures: lectures,
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

  async cancelLecture(title: string): Promise<AdminLectureResponseDto> {
    try {
      if (!title) {
        return {
          ok: false,
          message: '강의 제목을 입력해주세요',
        };
      }
      const lecture = await this.lectureRepositories.cancelLecture(title);

      return {
        ok: true,
        lectures: lecture,
        message: '강의가 취소되었습니다',
      };
    } catch (e) {
      return {
        ok: false,
        message: '강의 취소에 실패했습니다',
      };
    }
  }
}
