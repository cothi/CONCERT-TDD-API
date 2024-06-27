import { Application } from '../../../domain/entities/application.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { LectureCount } from '../../../domain/entities/lecture-count.entity';
import { User } from 'src/users/domain/entities/user.entity';
import { ApplicationDomain } from '../model/application.domain';
import { LectureRepository } from 'src/lecture/domain/repositories/lecture.repositories';
import { Lecture } from 'src/lecture/domain/entities/lecture.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { Transactional } from 'src/common/decorator/transaction.decorator';
import { QueryError } from 'mysql2';

export const LectureRepositorySymbol = Symbol('SpecialLectureRepository');
export class LectureRepositoryImpl implements LectureRepository {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  @Transactional()
  async getAllLectures(queryRunner?: QueryRunner): Promise<Lecture[]> {
    return queryRunner.manager.find(Lecture);
  }
  @Transactional()
  async getLecture(title: string, queryRunner?: QueryRunner): Promise<Lecture> {
    return await queryRunner.manager.findOne(Lecture, {
      where: { title },
      relations: ['lectureCount'],
    });
  }
  @Transactional()
  async getLectureCount(
    title: string,
    queryRunner?: QueryRunner,
  ): Promise<LectureCount> {
    return await queryRunner.manager.findOne(LectureCount, {
      where: { title },
    });
  }
  @Transactional()
  async getApplicationsByName(
    name: string,
    queryRunner?: QueryRunner,
  ): Promise<Application[]> {
    return await queryRunner.manager.find(Application, {
      where: { user: { name } },
      relations: ['user'],
    });
  }

  private async findLockLecture(
    queryRunner: QueryRunner,
    title: string,
  ): Promise<Lecture> {
    const lecture = await queryRunner.manager.findOne(Lecture, {
      where: { title: title },
      lock: { mode: 'pessimistic_write' },
    });
    if (!lecture) {
      throw new Error('강의가 존재하지 않습니다.');
    }
    return lecture;
  }

  private async findUser(
    queryRunner: QueryRunner,
    email: string,
  ): Promise<User> {
    const user = await queryRunner.manager.findOne(User, {
      where: { email },
    });

    if (!User) throw new Error('사용자를 찾을 수 없습니다.');
    return user;
  }
  private async incrementLectureCount(
    queryRunner: QueryRunner,
    lecture: Lecture,
  ): Promise<void> {
    await queryRunner.manager.increment(
      LectureCount,
      { title: lecture.title },
      'count',
      1,
    );
  }

  private async validateApplication(
    queryRunner: QueryRunner,
    lecture: Lecture,
    data: ApplicationDomain,
  ) {
    // console.log(data.email);
    const [lectureCount, existingApplication] = await Promise.all([
      queryRunner.manager.findOne(LectureCount, {
        where: { title: data.title },
      }),
      queryRunner.manager.findOne(Application, {
        where: { lecture: { title: data.title }, user: { email: data.email } },
      }),
    ]);

    if (lectureCount.count >= lecture.maxApplicants) {
      throw new Error('강의 신청 인원을 더 이상 받지 않습니다.');
    }
    if (existingApplication) {
      throw new Error('이미 신청한 강의입니다.');
    }
  }
  @Transactional()
  async applyLecture(
    data: ApplicationDomain,
    queryRunner?: QueryRunner,
  ): Promise<Application> {
    const applicationDomain: ApplicationDomain = data;
    const lecture = await this.findLockLecture(
      queryRunner,
      applicationDomain.title,
    );
    const user = await this.findUser(queryRunner, applicationDomain.email);
    await this.validateApplication(queryRunner, lecture, applicationDomain);
    await this.incrementLectureCount(queryRunner, lecture);
    return queryRunner.manager.save(Application, { lecture, user });
  }
}
