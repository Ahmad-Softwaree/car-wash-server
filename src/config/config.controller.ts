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
import { CompanyInfo, Config } from 'database/types';
import { UpdateConfigDto } from './dto/update-configdto';
import { ENUMs } from 'lib/enum';
import { CompanyDto } from './dto/update-company.dto';
import { InsetCompanyImageDto } from './dto/insert-image.dto';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @UseGuards(AuthGuard, PartGuard)
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

  @Get('/company_info')
  async getCompanyData(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<CompanyInfo>> {
    try {
      let company_info: CompanyInfo = await this.configService.getCompanyData();
      return res.status(HttpStatus.OK).json(company_info);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @UseGuards(AuthGuard, PartGuard)
  @PartName([ENUMs.COMPANY_INFO_PART as string])
  @Put('/company_info')
  async updateCompanyInfo(
    @Body() body: CompanyDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<CompanyInfo>> {
    try {
      const company_info: CompanyInfo =
        await this.configService.updateCompanyInfo(body);
      return res.status(HttpStatus.OK).json(company_info);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @UseGuards(AuthGuard, PartGuard)
  @PartName([ENUMs.COMPANY_INFO_PART as string])
  @Put('/insert_image')
  async insertImage(
    @Body() body: InsetCompanyImageDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<CompanyInfo>> {
    try {
      const company_info: CompanyInfo =
        await this.configService.insertImage(body);
      return res.status(HttpStatus.OK).json(company_info);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @UseGuards(AuthGuard, PartGuard)
  @PartName([ENUMs.COMPANY_INFO_PART as string])
  @Put('/delete_image')
  async deleteImage(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<CompanyInfo>> {
    try {
      const company_info: CompanyInfo = await this.configService.deleteImage();
      return res.status(HttpStatus.OK).json(company_info);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @UseGuards(AuthGuard, PartGuard)
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
