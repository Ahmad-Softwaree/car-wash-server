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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ENUMs } from 'lib/enum';

import CreateCarTypeDto from './dto/create-car-type.dto';
import UpdateCarTypeDto from './dto/update-car-type.dto';
import { CarType } from 'database/types';

@UseGuards(AuthGuard, PartGuard)
@ApiTags('car-type')
@Controller('car-type')
export class CarTypeController {
  constructor(private readonly carTypeService: CarTypeService) {}
  @PartName([ENUMs.CAR_TYPES_PART as string])
  @ApiOperation({ summary: 'Get All CarTypes' })
  @ApiResponse({
    status: 200,
    description: 'CarTypes retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'CarTypes not found.' })
  @HttpCode(HttpStatus.OK)
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
  @PartName([ENUMs.RESERVATION_PART as string])
  @ApiOperation({ summary: 'Get Select CarTypes' })
  @ApiResponse({
    status: 200,
    description: 'CarTypes retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'CarTypes not found.' })
  @HttpCode(HttpStatus.OK)
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
  @ApiOperation({ summary: 'Get All Deleted CarTypes' })
  @ApiResponse({
    status: 200,
    description: 'Deleted CarTypes retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Deleted CarTypes not found.' })
  @HttpCode(HttpStatus.OK)
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
  @ApiOperation({ summary: 'Search CarTypes' })
  @ApiResponse({
    status: 200,
    description: 'CarTypes retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'CarTypes not found.' })
  @HttpCode(HttpStatus.OK)
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
  @ApiOperation({ summary: 'Search CarTypes' })
  @ApiResponse({
    status: 200,
    description: 'CarTypes retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'CarTypes not found.' })
  @HttpCode(HttpStatus.OK)
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
  @ApiOperation({ summary: 'Add CarType' })
  @ApiResponse({
    status: 200,
    description: 'CarType created successfully.',
  })
  @HttpCode(HttpStatus.OK)
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
  @ApiOperation({
    summary: 'Resotre CarType By Id (deleted flag in database)',
  })
  @ApiParam({ name: 'id', description: 'CarType ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'CarType deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'CarType not found.' })
  @HttpCode(HttpStatus.OK)
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
  @ApiOperation({ summary: 'Update CarType By Id' })
  @ApiParam({ name: 'id', description: 'CarType ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'CarType Updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'CarType not found.' })
  @HttpCode(HttpStatus.OK)
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
  @ApiOperation({
    summary: 'Delete CarType By Id (restore flag in database)',
  })
  @ApiParam({ name: 'id', description: 'CarType ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'CarType restore successfully.',
  })
  @ApiResponse({ status: 404, description: 'CarType not found.' })
  @HttpCode(HttpStatus.OK)
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
