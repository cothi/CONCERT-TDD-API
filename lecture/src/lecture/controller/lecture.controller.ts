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
import { CreateLectureDto } from '../dto/create-lecture.dto';
import { UpdateLectureDto } from '../dto/update-lecture.dto';
import { LectureServiceSymbol } from '../services/lecture.service.impl';
import { LectureService } from '../services/lecture.serivce';

@Controller('lecture')
export class LectureController {
  constructor(
    @Inject(LectureServiceSymbol)
    private readonly lectureService: LectureService) { }

  @Get('cancel/:id')
  async cancelLecture(@Param('id') id: string) {
    return await this.lectureService.cancelLecture(id);
  }

  @Post('create')
  async createLecture(@Body() createLectureDto: CreateLectureDto) {
    return await this.lectureService.createLecture(createLectureDto);
  }

  @Get('get/:id')
  async getLecture(@Param('id') id: number) {
    return await this.lectureService.getLecture(id);
  }

  @Get('gets')
  async getAllLectures() {
    return await this.lectureService.getAllLectures();
  }
}
