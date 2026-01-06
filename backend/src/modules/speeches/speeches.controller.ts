import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SpeechesService } from './speeches.service';
import { SttResponseDto } from './dto/SttResponseDto.dto';

@Controller('speeches')
export class SpeechesController {
  constructor(private readonly recordsService: SpeechesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('audio'))
  async speechToText(
    @UploadedFile() recordFile: Express.Multer.File,
  ): Promise<SttResponseDto> {
    this.recordsService.checkValidation(recordFile);
    const text = await this.recordsService.speechToText(recordFile);

    return { text };
  }
}
