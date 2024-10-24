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
} from '@nestjs/common';
import { SellService } from './sell.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PartGuard } from 'src/auth/part.guard';
import { PartName } from 'src/auth/part.decorator';
import { ENUMs } from 'lib/enum';
import { Request, Response } from 'express';
import { Sell, SellItem } from 'database/types';
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
import { UpdateSellDto } from './dto/update-sell.dto';
import { AddItemToSellDto } from './dto/add-item-to-sell.dto';
import { UpdateItemToSellDto } from './dto/update-item-to-sell';
import { RestoreSellDto } from './dto/restore-sell.dto';

@UseGuards(AuthGuard, PartGuard)
@Controller('sell')
export class SellController {
  constructor(private readonly sellService: SellService) {}
  @PartName([ENUMs.SELL_PART as string])
  @Get('')
  async getAll(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('userFilter') userFilter: Filter,

    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<Sell[]>>> {
    try {
      let users: PaginationReturnType<Sell[]> = await this.sellService.getAll(
        page,
        limit,
        userFilter,
        from,
        to,
      );
      return res.status(HttpStatus.OK).json(users);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.SELL_PART as string])
  @Get('/deleted')
  async getAllDeleted(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('userFilter') userFilter: Filter,

    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<Sell[]>>> {
    try {
      let users: PaginationReturnType<Sell[]> =
        await this.sellService.getAllDeleted(page, limit, userFilter, from, to);
      return res.status(HttpStatus.OK).json(users);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.SELL_PART as string])
  @Get('/search')
  async search(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<Sell[]>> {
    try {
      let users: Sell[] = await this.sellService.search(search);
      return res.status(HttpStatus.OK).json(users);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.SELL_PART as string])
  @Get('/deleted_search')
  async deletedSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<Sell[]>> {
    try {
      let users: Sell[] = await this.sellService.deletedSearch(search);
      return res.status(HttpStatus.OK).json(users);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CREATE_PSULA_PART as string, ENUMs.SELL_PART as string])
  @Get('sell/:id')
  async getOne(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: Id,
  ): Promise<Response<Sell>> {
    try {
      let sell: Sell = await this.sellService.findOne(id);
      return res.status(HttpStatus.OK).json(sell);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CREATE_PSULA_PART as string, ENUMs.SELL_PART as string])
  @Get('sell_items/:sell_id')
  async getSellItems(
    @Req() req: Request,
    @Res() res: Response,
    @Param('sell_id', ParseIntPipe) sell_id: Id,
  ): Promise<Response<SellItem[]>> {
    try {
      let sellItems: SellItem[] = await this.sellService.getSellItems(sell_id);
      return res.status(HttpStatus.OK).json(sellItems);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.SELL_PART as string])
  @Get('self_deleted_sell_items')
  async getSelfDeletedSellItems(
    @Req() req: Request,
    @Res() res: Response,
    @Query('userFilter') userFilter: Filter,

    @Query('page') page: Page,
    @Query('limit') limit: Limit,
  ): Promise<Response<PaginationReturnType<SellItem[]>>> {
    try {
      let sellItems: PaginationReturnType<SellItem[]> =
        await this.sellService.getSelfDeletedSellItems(page, limit, userFilter);
      return res.status(HttpStatus.OK).json(sellItems);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.SELL_PART as string])
  @Get('search_deleted_sell_items')
  async searchSelfDeletedSellItems(
    @Req() req: Request,
    @Res() res: Response,

    @Query('search') search: Search,
  ): Promise<Response<SellItem[]>> {
    try {
      let sellItems: SellItem[] =
        await this.sellService.searchSelfDeletedSellItems(search);
      return res.status(HttpStatus.OK).json(sellItems);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.SELL_PART as string])
  @Get('deleted_sell_items/:sell_id')
  async getDeletedSellItems(
    @Req() req: Request,
    @Res() res: Response,
    @Query('userFilter') userFilter: Filter,

    @Param('sell_id', ParseIntPipe) sell_id: Id,
  ): Promise<Response<SellItem[]>> {
    try {
      let sellItems: SellItem[] = await this.sellService.getDeletedSellItems(
        sell_id,
        userFilter,
      );
      return res.status(HttpStatus.OK).json(sellItems);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CREATE_PSULA_PART as string])
  @Post('')
  async create(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Sell>> {
    try {
      const sell: Sell = await this.sellService.create(req['user'].id);
      return res.status(HttpStatus.OK).json(sell);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CREATE_PSULA_PART as string, ENUMs.SELL_PART as string])
  @Post('print/:sell_id')
  async print(
    @Req() req: Request,
    @Res() res: Response,
    @Param('sell_id', ParseIntPipe) sell_id: Id,
  ): Promise<
    Response<{
      sell: Sell;
      sellItems: SellItem[];
    }>
  > {
    try {
      let data: {
        sell: Sell;
        sellItems: SellItem[];
      } = await this.sellService.print(sell_id);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CREATE_PSULA_PART as string, ENUMs.SELL_PART as string])
  @Put('restore/:id')
  async restore(
    @Body() body: RestoreSellDto,

    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: Id,
  ): Promise<Response<Id>> {
    try {
      const sell: Id = await this.sellService.restore(id, body);
      return res.status(HttpStatus.OK).json(sell);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CREATE_PSULA_PART as string, ENUMs.SELL_PART as string])
  @Put('restore_self_deleted_sell_item/:id')
  async restoreSelfDeletedSellItem(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: Id,
  ): Promise<Response<Id>> {
    try {
      const sell: Id = await this.sellService.restoreSelfDeletedSellItem(id);
      return res.status(HttpStatus.OK).json(sell);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CREATE_PSULA_PART as string])
  @Put(':id')
  async update(
    @Body() body: UpdateSellDto,
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: Id,
  ): Promise<Response<Sell>> {
    try {
      const sell: Sell = await this.sellService.update(
        id,
        body,
        req['user'].id,
      );
      return res.status(HttpStatus.OK).json(sell);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CREATE_PSULA_PART as string])
  @Put('add_item_to_sell/:sell_id')
  async addItemToSell(
    @Body() body: AddItemToSellDto,
    @Req() req: Request,
    @Res() res: Response,
    @Param('sell_id', ParseIntPipe) sell_id: Id,
  ): Promise<Response<SellItem>> {
    try {
      const sell_item: SellItem = await this.sellService.addItemToSell(
        sell_id,
        body,
        req['user'].id,
      );
      return res.status(HttpStatus.OK).json(sell_item);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.CREATE_PSULA_PART as string])
  @Put('update_item_in_sell/:sell_id/:item_id')
  async updateItemInSell(
    @Body() body: UpdateItemToSellDto,
    @Req() req: Request,
    @Res() res: Response,
    @Param('sell_id', ParseIntPipe) sell_id: Id,
    @Param('item_id', ParseIntPipe) item_id: Id,
  ): Promise<Response<SellItem>> {
    try {
      const sell_item: SellItem = await this.sellService.updateItemInSell(
        sell_id,
        item_id,
        body,
        req['user'].id,
      );
      return res.status(HttpStatus.OK).json(sell_item);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.CREATE_PSULA_PART as string])
  @Put('increase_item_in_sell/:sell_id/:item_id')
  async increaseItemInSell(
    @Req() req: Request,
    @Res() res: Response,
    @Param('sell_id', ParseIntPipe) sell_id: Id,
    @Param('item_id', ParseIntPipe) item_id: Id,
  ): Promise<Response<SellItem>> {
    try {
      const sell_item: SellItem = await this.sellService.increaseItemInSell(
        sell_id,
        item_id,
        req['user'].id,
      );
      return res.status(HttpStatus.OK).json(sell_item);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CREATE_PSULA_PART as string])
  @Put('decrease_item_in_sell/:sell_id/:item_id')
  async decreaseItemInSell(
    @Req() req: Request,
    @Res() res: Response,
    @Param('sell_id', ParseIntPipe) sell_id: Id,
    @Param('item_id', ParseIntPipe) item_id: Id,
  ): Promise<Response<SellItem>> {
    try {
      const sell_item: SellItem = await this.sellService.decreaseItemInSell(
        sell_id,
        item_id,
        req['user'].id,
      );
      return res.status(HttpStatus.OK).json(sell_item);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CREATE_PSULA_PART as string])
  @Put('delete_item_in_sell/:sell_id/:item_id')
  async deleteItemInSell(
    @Req() req: Request,
    @Res() res: Response,
    @Param('sell_id', ParseIntPipe) sell_id: Id,
    @Param('item_id', ParseIntPipe) item_id: Id,
  ): Promise<Response<Id>> {
    try {
      const sell_item: Id = await this.sellService.deleteItemInSell(
        sell_id,
        item_id,
      );
      return res.status(HttpStatus.OK).json(sell_item);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CREATE_PSULA_PART as string])
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: Id,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Id>> {
    try {
      const sell: Id = await this.sellService.delete(id);
      return res.status(HttpStatus.OK).json(sell);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
