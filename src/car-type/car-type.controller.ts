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
import { CarTypeService } from './car-type.service';
import { Request, Response } from 'express';

import {
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

import CreateCarTypeDto from './dto/create-car-type.dto';
import UpdateCarTypeDto from './dto/update-car-type.dto';
import { CarType } from 'database/types';

@UseGuards(AuthGuard, PartGuard)
@Controller('car-type')
export class CarTypeController {
  constructor(private readonly carTypeService: CarTypeService) {}
  @PartName([ENUMs.CAR_TYPES_PART as string])
  @Get('')
  async getAll(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<CarType[]>>> {
    try {
      let carTypes: PaginationReturnType<CarType[]> =
        await this.carTypeService.getAll(page, limit, from, to);
      return res.status(HttpStatus.OK).json(carTypes);
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
  ): Promise<Response<CarType[]>> {
    try {
      let carTypes: CarType[] = await this.carTypeService.getSelect();
      return res.status(HttpStatus.OK).json(carTypes);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CAR_TYPES_PART as string])
  @Get('/deleted')
  async getAllDeleted(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<CarType[]>>> {
    try {
      let carTypes: PaginationReturnType<CarType[]> =
        await this.carTypeService.getAllDeleted(page, limit, from, to);
      return res.status(HttpStatus.OK).json(carTypes);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CAR_TYPES_PART as string])
  @Get('/search')
  async search(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<CarType[]>> {
    try {
      let carTypes: CarType[] = await this.carTypeService.search(search);
      return res.status(HttpStatus.OK).json(carTypes);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CAR_TYPES_PART as string])
  @Get('/deleted_search')
  async deletedSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<CarType[]>> {
    try {
      let carTypes: CarType[] = await this.carTypeService.deletedSearch(search);
      return res.status(HttpStatus.OK).json(carTypes);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.CAR_TYPES_PART as string])
  @Post('')
  @UsePipes(new ValidationPipe())
  async create(
    @Body() body: CreateCarTypeDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<CarType>> {
    try {
      const carType: CarType = await this.carTypeService.create(body);
      return res.status(HttpStatus.OK).json(carType);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CAR_TYPES_PART as string])
  @Put('/restore/:id')
  async restore(
    @Param('id', ParseIntPipe) id: Id,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Id>> {
    try {
      const carType: Id = await this.carTypeService.restore(id);
      return res.status(HttpStatus.OK).json(carType);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CAR_TYPES_PART as string])
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', ParseIntPipe) id: Id,
    @Body() body: UpdateCarTypeDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<CarType>> {
    try {
      const carType: CarType = await this.carTypeService.update(id, body);
      return res.status(HttpStatus.OK).json(carType);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CAR_TYPES_PART as string])
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: Id,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Id>> {
    try {
      const carType: Id = await this.carTypeService.delete(id);
      return res.status(HttpStatus.OK).json(carType);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
