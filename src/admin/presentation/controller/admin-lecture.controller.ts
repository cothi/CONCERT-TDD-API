import { AdminLectureResponseDto } from './../dto/response/admin-lecture.response.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { LectureRegisterRequestDto } from '../dto/request/admin-lecture.request.dto';
import { AdminLectureService } from 'src/admin/application/services/admin.service';
import { LectureDomain } from 'src/admin/infrastructure/persistence/model/Lecture.domin.model';
import { AdminLectureServiceSymbol } from 'src/admin/application/services/admin.service.impl';

@Controller('admin')
export class AdminLectureController {
  constructor(
    @Inject(AdminLectureServiceSymbol)
    private readonly adminLectureService: AdminLectureService,
  ) {}

  @Get('gets')
  async getAllLectures(): Promise<AdminLectureResponseDto> {
    return await this.adminLectureService.getAllLectures();
  }
  @Get('cancel/:title')
  async cancelLecture(
    @Param('title') title: string,
  ): Promise<AdminLectureResponseDto> {
    return await this.adminLectureService.cancelLecture(title);
  }

  @Post('create')
  async createLecture(
    @Body() data: LectureRegisterRequestDto,
  ): Promise<AdminLectureResponseDto> {
    const lectureDomain = LectureDomain.toDomain(data);
    return await this.adminLectureService.createLecture(lectureDomain);
  }

  @Get(':title')
  async getLecture(
    @Param('title') title: string,
  ): Promise<AdminLectureResponseDto> {
    return await this.adminLectureService.getLecture(title);
  }
}
