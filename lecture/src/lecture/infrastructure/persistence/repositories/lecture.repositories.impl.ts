import { Application } from '../../../domain/entities/application.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { LectureCount } from '../../../domain/entities/lecture-count.entity';
import { User } from 'src/users/entities/user.entity';
import { ApplicationDomain } from '../model/application.domain';
import { LectureRepository } from 'src/lecture/domain/repositories/lecture.repositories';
import { Lecture } from 'src/lecture/domain/entities/lecture.entity';
import { InjectDataSource } from '@nestjs/typeorm';

export const LectureRepositorySymbol = Symbol('SpecialLectureRepository');
export class LectureRepositoryImpl implements LectureRepository {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async applyLecture(data: ApplicationDomain): Promise<Application> {
    return await this.executeInTransaction(async (queryRunner) => {
      const lecture = await this.findLockLecture(queryRunner, data.title);
      const user = await this.findUser(queryRunner, data.email);
      await this.validateApplication(queryRunner, lecture, data);
      await this.incrementLectureCount(queryRunner, lecture);
      return queryRunner.manager.save(Application, { lecture, user });
    });
  }

  async getAllLectures(): Promise<Lecture[]> {
    return await this.executeInTransaction(async (queryRunner) => {
      return queryRunner.manager.find(Lecture);
    });
  }
  async getLecture(title: string): Promise<Lecture> {
    return await this.executeInTransaction(async (queryRunner) => {
      const lecture = await queryRunner.manager.findOne(Lecture, {
        where: { title },
        relations: ['lectureCount'],
      });
      return lecture;
    });
  }
  async getLectureCount(title: string): Promise<LectureCount> {
    return await this.executeInTransaction(async (queryRunner) => {
      return await queryRunner.manager.findOne(LectureCount, {
        where: { title },
      });
    });
  }
  async getApplicationsByName(name: string): Promise<Application[]> {
    return await this.executeInTransaction(async (queryRunner) => {
      return await queryRunner.manager.find(Application, {
        where: { user: { name } },
        relations: ['user'],
      });
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
  ): Promise<void> {
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

  private async executeInTransaction<T>(
    operation: (queryRunner: QueryRunner) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const res = await operation(queryRunner);
      await queryRunner.commitTransaction();
      return res;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
