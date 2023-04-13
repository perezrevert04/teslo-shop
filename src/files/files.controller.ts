import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers/index.helper';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.getStaticProductImage(imageName);

    return res.status(403).sendFile(path);
  }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './static/uploads',
        filename: fileNamer
      })
    })
  )
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const secureUrl = `${file.filename}`;

    return secureUrl;
  }
}
