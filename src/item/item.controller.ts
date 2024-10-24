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
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

import { ItemService } from './item.service';

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
import { CreateItemDto } from './dto/create-item-dto';
import { UpdateItemDto } from './dto/update-item-dto';
import { PartGuard } from 'src/auth/part.guard';
import { PartName } from 'src/auth/part.decorator';
import { ItemWithType } from 'src/types/item';
import { ENUMs } from 'lib/enum';
import { ChangeItemQuantityDto } from './dto/change-item-quantity-dto';
import { Item } from 'database/types';

@UseGuards(AuthGuard, PartGuard)
@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @PartName([ENUMs.KOGA_PART as string])
  @Get('/less')
  async getLess(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('filter') filter: Filter,
    @Query('userFilter') userFilter: Filter,

    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<Item[]>>> {
    try {
      let items: PaginationReturnType<Item[]> = await this.itemService.getLess(
        page,
        limit,
        from,
        filter,
        userFilter,
        to,
      );
      return res.status(HttpStatus.OK).json(items);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.KOGA_PART as string])
  @Get('/search_less')
  async searchLess(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<Item[]>> {
    try {
      let items: Item[] = await this.itemService.searchLess(search);
      return res.status(HttpStatus.OK).json(items);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.KOGA_PART as string])
  @Get('')
  async getAll(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('filter') filter: Filter,
    @Query('userFilter') userFilter: Filter,

    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<ItemWithType[]>>> {
    try {
      let items: PaginationReturnType<ItemWithType[]> =
        await this.itemService.getAll(
          page,
          limit,
          filter,
          userFilter,
          from,
          to,
        );
      return res.status(HttpStatus.OK).json(items);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.KOGA_PART as string])
  @Get('/deleted')
  async getAllDeleted(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('filter') filter: Filter,
    @Query('userFilter') userFilter: Filter,

    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<ItemWithType[]>>> {
    try {
      let items: PaginationReturnType<ItemWithType[]> =
        await this.itemService.getAllDeleted(
          page,
          limit,
          filter,
          userFilter,
          from,
          to,
        );
      return res.status(HttpStatus.OK).json(items);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.KOGA_PART as string])
  @Get('/search')
  async search(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<ItemWithType[]>> {
    try {
      let items: ItemWithType[] = await this.itemService.search(search);
      return res.status(HttpStatus.OK).json(items);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.KOGA_PART as string])
  @Get('/deleted_search')
  async deletedSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<ItemWithType[]>> {
    try {
      let items: ItemWithType[] = await this.itemService.deletedSearch(search);
      return res.status(HttpStatus.OK).json(items);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.KOGA_PART as string])
  @Get(':id')
  async getOne(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: Id,
  ): Promise<Response<ItemWithType>> {
    try {
      let item: ItemWithType = await this.itemService.findOne(id);
      return res.status(HttpStatus.OK).json(item);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.KOGA_PART as string])
  @Post()
  @UsePipes(new ValidationPipe())
  async create(
    @Body() body: CreateItemDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Item>> {
    try {
      const item: Item = await this.itemService.create(body, req['user'].id);
      return res.status(HttpStatus.OK).json(item);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.USERS_PART as string])
  @Put('/restore/:id')
  async restore(
    @Param('id', ParseIntPipe) id: Id,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Id>> {
    try {
      const user: Id = await this.itemService.restore(id);
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.KOGA_PART as string])
  @Put('change_quantity/:id/:type')
  @UsePipes(new ValidationPipe())
  async changeQuantity(
    @Param('id', ParseIntPipe) id: Id,
    @Param('type') type: 'increase' | 'decrease',

    @Body() body: ChangeItemQuantityDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<ItemWithType>> {
    try {
      const item: ItemWithType = await this.itemService.changeQuantity(
        id,
        type,
        body,
        req['user'].id,
      );
      return res.status(HttpStatus.OK).json(item);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.KOGA_PART as string])
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', ParseIntPipe) id: Id,
    @Body() body: UpdateItemDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Item>> {
    try {
      const item: Item = await this.itemService.update(
        id,
        body,
        req['user'].id,
      );
      return res.status(HttpStatus.OK).json(item);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.KOGA_PART as string])
  @Put('delete_image/:id')
  async deleteImage(
    @Param('id', ParseIntPipe) id: Id,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Item>> {
    try {
      const item: Item = await this.itemService.deleteImage(id);
      return res.status(HttpStatus.OK).json(item);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.KOGA_PART as string])
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: Id,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Id>> {
    try {
      const item: Id = await this.itemService.delete(id);
      return res.status(HttpStatus.OK).json(item);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
