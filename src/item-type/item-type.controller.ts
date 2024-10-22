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
import { ItemTypeService } from './item-type.service';
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

import CreateItemTypeDto from './dto/create-item-type.dto';
import UpdateItemTypeDto from './dto/update-item-type.dto';
import { ItemType } from 'database/types';

@UseGuards(AuthGuard, PartGuard)
@Controller('item-type')
export class ItemTypeController {
  constructor(private readonly itemTypeService: ItemTypeService) {}
  @PartName([ENUMs.ITEM_TYPES_PART as string])
  @Get('')
  async getAll(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<ItemType[]>>> {
    try {
      let itemTypes: PaginationReturnType<ItemType[]> =
        await this.itemTypeService.getAll(page, limit, from, to);
      return res.status(HttpStatus.OK).json(itemTypes);
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
  ): Promise<Response<ItemType[]>> {
    try {
      let roles: ItemType[] = await this.itemTypeService.getSelect();
      return res.status(HttpStatus.OK).json(roles);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.ITEM_TYPES_PART as string])
  @Get('/deleted')
  async getAllDeleted(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<ItemType[]>>> {
    try {
      let itemTypes: PaginationReturnType<ItemType[]> =
        await this.itemTypeService.getAllDeleted(page, limit, from, to);
      return res.status(HttpStatus.OK).json(itemTypes);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.ITEM_TYPES_PART as string])
  @Get('/search')
  async search(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<ItemType[]>> {
    try {
      let itemTypes: ItemType[] = await this.itemTypeService.search(search);
      return res.status(HttpStatus.OK).json(itemTypes);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.ITEM_TYPES_PART as string])
  @Get('/deleted_search')
  async deletedSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<ItemType[]>> {
    try {
      let itemTypes: ItemType[] =
        await this.itemTypeService.deletedSearch(search);
      return res.status(HttpStatus.OK).json(itemTypes);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.ITEM_TYPES_PART as string])
  @Post('')
  @UsePipes(new ValidationPipe())
  async create(
    @Body() body: CreateItemTypeDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<ItemType>> {
    try {
      const itemType: ItemType = await this.itemTypeService.create(body);
      return res.status(HttpStatus.OK).json(itemType);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.ITEM_TYPES_PART as string])
  @Put('/restore/:id')
  async restore(
    @Param('id', ParseIntPipe) id: Id,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Id>> {
    try {
      const itemType: Id = await this.itemTypeService.restore(id);
      return res.status(HttpStatus.OK).json(itemType);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.ITEM_TYPES_PART as string])
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', ParseIntPipe) id: Id,
    @Body() body: UpdateItemTypeDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<ItemType>> {
    try {
      const itemType: ItemType = await this.itemTypeService.update(id, body);
      return res.status(HttpStatus.OK).json(itemType);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.ITEM_TYPES_PART as string])
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: Id,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Id>> {
    try {
      const itemType: Id = await this.itemTypeService.delete(id);
      return res.status(HttpStatus.OK).json(itemType);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
