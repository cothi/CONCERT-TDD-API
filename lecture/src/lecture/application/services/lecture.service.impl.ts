import { Inject, Injectable } from '@nestjs/common';
import { ApplyLectureDto } from '../dto/apply-lecture.dto';
import { LectureService } from './lecture.service';
import { ApplyLectureResponseDto } from 'src/lecture/presentation/dto/response/apply-lecture.output.dto';
import { LectureRepositorySymbol } from 'src/lecture/infrastructure/persistence/repositories/lecture.repositories.impl';
import { LectureRepository } from 'src/lecture/domain/repositories/lecture.repositories';
import { ApplicationDomain } from 'src/lecture/infrastructure/persistence/model/application.domain';

export const LectureServiceSymbol = Symbol('LectureService');

@Injectable()
export class LectureServiceImpl implements LectureService {
  constructor(
    @Inject(LectureRepositorySymbol)
    private readonly lectureRepository: LectureRepository,
  ) {}
  async applySpecialLecture(
    data: ApplyLectureDto,
  ): Promise<ApplyLectureResponseDto> {
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
}
