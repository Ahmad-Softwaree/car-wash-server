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
import { ColorService } from './color.service';
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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ENUMs } from 'lib/enum';

import CreateColorDto from './dto/create-color.dto';
import UpdateColorDto from './dto/update-color.dto';
import { Color } from 'database/types';

@UseGuards(AuthGuard, PartGuard)
@ApiTags('color')
@Controller('color')
export class ColorController {
  constructor(private readonly colorService: ColorService) {}
  @PartName([ENUMs.COLORS_PART as string])
  @ApiOperation({ summary: 'Get All Colors' })
  @ApiResponse({
    status: 200,
    description: 'Colors retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Colors not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('')
  async getAll(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<Color[]>>> {
    try {
      let colors: PaginationReturnType<Color[]> =
        await this.colorService.getAll(page, limit, from, to);
      return res.status(HttpStatus.OK).json(colors);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.RESERVATION_PART as string])
  @ApiOperation({ summary: 'Get Select Colors' })
  @ApiResponse({
    status: 200,
    description: 'Colors retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Colors not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('/select')
  async getSelect(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Color[]>> {
    try {
      let colors: Color[] = await this.colorService.getSelect();
      return res.status(HttpStatus.OK).json(colors);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.COLORS_PART as string])
  @ApiOperation({ summary: 'Get All Deleted Colors' })
  @ApiResponse({
    status: 200,
    description: 'Deleted Colors retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Deleted Colors not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('/deleted')
  async getAllDeleted(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<Color[]>>> {
    try {
      let colors: PaginationReturnType<Color[]> =
        await this.colorService.getAllDeleted(page, limit, from, to);
      return res.status(HttpStatus.OK).json(colors);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.COLORS_PART as string])
  @ApiOperation({ summary: 'Search Colors' })
  @ApiResponse({
    status: 200,
    description: 'Colors retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Colors not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('/search')
  async search(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<Color[]>> {
    try {
      let colors: Color[] = await this.colorService.search(search);
      return res.status(HttpStatus.OK).json(colors);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.COLORS_PART as string])
  @ApiOperation({ summary: 'Search Colors' })
  @ApiResponse({
    status: 200,
    description: 'Colors retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'Colors not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('/deleted_search')
  async deletedSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<Color[]>> {
    try {
      let colors: Color[] = await this.colorService.deletedSearch(search);
      return res.status(HttpStatus.OK).json(colors);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.COLORS_PART as string])
  @ApiOperation({ summary: 'Add Color' })
  @ApiResponse({
    status: 200,
    description: 'Color created successfully.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('')
  @UsePipes(new ValidationPipe())
  async create(
    @Body() body: CreateColorDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Color>> {
    try {
      const color: Color = await this.colorService.create(body);
      return res.status(HttpStatus.OK).json(color);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.COLORS_PART as string])
  @ApiOperation({
    summary: 'Resotre Color By Id (deleted flag in database)',
  })
  @ApiParam({ name: 'id', description: 'Color ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Color deleted successfully.',
  })
  @ApiResponse({ status: 404, description: 'Color not found.' })
  @HttpCode(HttpStatus.OK)
  @Put('/restore/:id')
  async restore(
    @Param('id', ParseIntPipe) id: Id,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Id>> {
    try {
      const color: Id = await this.colorService.restore(id);
      return res.status(HttpStatus.OK).json(color);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.COLORS_PART as string])
  @ApiOperation({ summary: 'Update Color By Id' })
  @ApiParam({ name: 'id', description: 'Color ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Color Updated successfully.',
  })
  @ApiResponse({ status: 404, description: 'Color not found.' })
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', ParseIntPipe) id: Id,
    @Body() body: UpdateColorDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Color>> {
    try {
      const color: Color = await this.colorService.update(id, body);
      return res.status(HttpStatus.OK).json(color);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.COLORS_PART as string])
  @ApiOperation({
    summary: 'Delete Color By Id (restore flag in database)',
  })
  @ApiParam({ name: 'id', description: 'Color ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Color restore successfully.',
  })
  @ApiResponse({ status: 404, description: 'Color not found.' })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: Id,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Id>> {
    try {
      const color: Id = await this.colorService.delete(id);
      return res.status(HttpStatus.OK).json(color);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
