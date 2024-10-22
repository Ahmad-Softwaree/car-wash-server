import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CarModelService } from './car-model.service';
import { Request, Response } from 'express';

import {
  Filter,
  From,
  Id,
  Limit,
  Page,
  PaginationReturnType,
  Search,
  To,
} from 'src/types/global';
import { AuthGuard } from 'src/auth/auth.guard';
import { PartGuard } from 'src/auth/part.guard';
import { PartName } from 'src/auth/part.decorator';
import { ENUMs } from 'lib/enum';

import CreateCarModelDto from './dto/create-car-model.dto';
import UpdateCarModelDto from './dto/update-car-model.dto';
import { CarModel } from 'database/types';

@UseGuards(AuthGuard, PartGuard)
@Controller('car-model')
export class CarModelController {
  constructor(private readonly carModelService: CarModelService) {}
  @PartName([ENUMs.CAR_MODELS_PART as string])
  @Get('')
  async getAll(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<CarModel[]>>> {
    try {
      let carModels: PaginationReturnType<CarModel[]> =
        await this.carModelService.getAll(page, limit, from, to);
      return res.status(HttpStatus.OK).json(carModels);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName(['all'])
  @Get('/select')
  async getSelect(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<CarModel[]>> {
    try {
      let carModels: CarModel[] = await this.carModelService.getSelect();
      return res.status(HttpStatus.OK).json(carModels);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CAR_MODELS_PART as string])
  @Get('/deleted')
  async getAllDeleted(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<CarModel[]>>> {
    try {
      let carModels: PaginationReturnType<CarModel[]> =
        await this.carModelService.getAllDeleted(page, limit, from, to);
      return res.status(HttpStatus.OK).json(carModels);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CAR_MODELS_PART as string])
  @Get('/search')
  async search(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<CarModel[]>> {
    try {
      let carModels: CarModel[] = await this.carModelService.search(search);
      return res.status(HttpStatus.OK).json(carModels);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CAR_MODELS_PART as string])
  @Get('/deleted_search')
  async deletedSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<CarModel[]>> {
    try {
      let carModels: CarModel[] =
        await this.carModelService.deletedSearch(search);
      return res.status(HttpStatus.OK).json(carModels);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.CAR_MODELS_PART as string])
  @Post('')
  @UsePipes(new ValidationPipe())
  async create(
    @Body() body: CreateCarModelDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<CarModel>> {
    try {
      const carModel: CarModel = await this.carModelService.create(body);
      return res.status(HttpStatus.OK).json(carModel);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CAR_MODELS_PART as string])
  @Put('/restore/:id')
  async restore(
    @Param('id', ParseIntPipe) id: Id,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Id>> {
    try {
      const carModel: Id = await this.carModelService.restore(id);
      return res.status(HttpStatus.OK).json(carModel);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CAR_MODELS_PART as string])
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', ParseIntPipe) id: Id,
    @Body() body: UpdateCarModelDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<CarModel>> {
    try {
      const carModel: CarModel = await this.carModelService.update(id, body);
      return res.status(HttpStatus.OK).json(carModel);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CAR_MODELS_PART as string])
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: Id,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Id>> {
    try {
      const carModel: Id = await this.carModelService.delete(id);
      return res.status(HttpStatus.OK).json(carModel);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
