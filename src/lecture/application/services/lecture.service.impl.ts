import { GetLectureCountResponseDto } from './../../presentation/dto/response/get-lecture-count.response.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ApplyLectureDto } from '../dto/apply-lecture.dto';
import { LectureService } from './lecture.service';
import { ApplyLectureResponseDto } from 'src/lecture/presentation/dto/response/apply-lecture.response.dto';
import { LectureRepositorySymbol } from 'src/lecture/infrastructure/persistence/repositories/lecture.repositories.impl';
import { LectureRepository } from 'src/lecture/domain/repositories/lecture.repositories';
import { ApplicationDomain } from 'src/lecture/infrastructure/persistence/model/application.domain';
import { GetLectures } from 'src/lecture/presentation/dto/response/get-lectures.response.dto';
import { GetApplicationsByNameResponseDto } from 'src/lecture/presentation/dto/response/get-applications-by-name.response.dto';

export const LectureServiceSymbol = Symbol('LectureService');

@Injectable()
export class LectureServiceImpl implements LectureService {
  constructor(
    @Inject(LectureRepositorySymbol)
    private readonly lectureRepository: LectureRepository,
  ) {}
  async applyLecture(data: ApplyLectureDto): Promise<ApplyLectureResponseDto> {
    try {
      const applicationDomain = ApplicationDomain.toDomain(data);
      const application =
        await this.lectureRepository.applyLecture(applicationDomain);
      return {
        applications: application,
        ok: true,
        message: '특강 신청이 완료되었습니다',
      };
    } catch (e) {
      return {
        ok: false,
        message: '특강 신청에 실패하였습니다',
      };
    }
  }

  async getAllLectures(): Promise<GetLectures> {
    try {
      const lectures = await this.lectureRepository.getAllLectures();
      return {
        lectures: lectures,
        ok: true,
        message: '모든 특강이 조회되었습니다',
      };
    } catch (e) {
      return {
        ok: false,
        message: '특강 조회에 실패했습니다',
      };
    }
  }
  async getLectureCount(title: string): Promise<GetLectureCountResponseDto> {
    try {
      const lecture = await this.lectureRepository.getLecture(title);

      return {
        title: title,
        count: lecture.maxApplicants - lecture.lectureCount.count,
        ok: true,
        message: '특강 신청 가능 인원이 조회되었습니다',
      };
    } catch (e) {
      return {
        ok: false,
        message: '특강 조회에 실패했습니다',
      };
    }
  }
  async getApplicationsByName(
    name: string,
  ): Promise<GetApplicationsByNameResponseDto> {
    const applications =
      await this.lectureRepository.getApplicationsByName(name);
    try {
      return {
        applications: applications,
        ok: true,
        message: '특강 신청자 조회가 완료되었습니다',
      };
    } catch (e) {
      return {
        ok: false,
        message: '특강 신청자 조회에 실패했습니다',
      };
    }
  }
}
