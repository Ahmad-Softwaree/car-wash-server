import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from './config.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PartGuard } from 'src/auth/part.guard';
import { PartName } from 'src/auth/part.decorator';
import { Request, Response } from 'express';
import { Config } from 'database/types';
import { UpdateConfigDto } from './dto/update-config-dto';
import { ENUMs } from 'lib/enum';

@UseGuards(AuthGuard, PartGuard)
@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @PartName(['all'])
  @Get('')
  async getAll(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Config>> {
    try {
      let config: Config = await this.configService.getAll();
      return res.status(HttpStatus.OK).json(config);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.CONFIG_PART as string])
  @Put(':key')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('key') key: string,
    @Body() body: UpdateConfigDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Config>> {
    try {
      const config: Config = await this.configService.update(key, body);
      return res.status(HttpStatus.OK).json(config);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
