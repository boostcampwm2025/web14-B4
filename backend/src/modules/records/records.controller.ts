import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RecordsService } from './records.service';
import { SttResponseDto } from './dto/SttResponseDto.dto';
import type { Multer } from 'multer';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('audio'))
  async speechToText(
    @UploadedFile() recordFile: Multer.File,
  ): Promise<SttResponseDto> {
    this.recordsService.checkValidation(recordFile);
    const text = await this.recordsService.speechToText(recordFile);

    return { text };
  }
}
