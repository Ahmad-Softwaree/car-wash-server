import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PartGuard } from 'src/auth/part.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PartName } from 'src/auth/part.decorator';
import { ENUMs } from 'lib/enum';
import { Request, Response } from 'express';
import {
  Filter,
  From,
  Limit,
  Page,
  PaginationReturnType,
  Search,
  To,
} from 'src/types/global';
import { Item, Sell, SellItem } from 'database/types';

@UseGuards(AuthGuard, PartGuard)
@ApiTags('report')
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
  //SELL REPORT
  @PartName([ENUMs.SELL_REPORT_PART as string])
  @ApiOperation({ summary: 'Get All Sell' })
  @ApiResponse({ status: 200, description: 'Sell retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Sell not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('sell')
  async getSell(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<Sell[]>>> {
    try {
      let data: PaginationReturnType<Sell[]> = await this.reportService.getSell(
        page,
        limit,
        from,
        to,
      );
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.SELL_REPORT_PART as string])
  @ApiOperation({ summary: 'Get All Sell' })
  @ApiResponse({ status: 200, description: 'Sell retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Sell not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('sell/information')
  async getSellInformation(
    @Req() req: Request,
    @Res() res: Response,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<any>> {
    try {
      let data: any = await this.reportService.getSellInformation(from, to);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.SELL_REPORT_PART as string])
  @ApiOperation({ summary: 'Get All Sell' })
  @ApiResponse({ status: 200, description: 'Sell retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Sell not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('sell_search')
  async getSellSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<Sell[]>> {
    try {
      let data: Sell[] = await this.reportService.getSellSearch(search);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.SELL_REPORT_PART as string])
  @ApiOperation({ summary: 'Get All Sell' })
  @ApiResponse({ status: 200, description: 'Sell retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Sell not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('sell_search/information')
  async getSellInformationSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<any>> {
    try {
      let data: any = await this.reportService.getSellInformationSearch(search);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.SELL_REPORT_PART as string])
  @ApiOperation({ summary: 'Get All Sell' })
  @ApiResponse({ status: 200, description: 'Sell retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Sell not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('sell/print')
  async SellPrint(
    @Req() req: Request,
    @Res() res: Response,
    @Query('from') from: From,
    @Query('to') to: To,
    @Query('search') search: Search,
  ): Promise<Response<void>> {
    try {
      await this.reportService.sellPrint(search, from, to, res);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  //ITEM REPORT

  @PartName([ENUMs.SELL_REPORT_PART as string])
  @ApiOperation({ summary: 'Get All Item' })
  @ApiResponse({ status: 200, description: 'Item retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('item')
  async getItem(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<SellItem[]>>> {
    try {
      let data: PaginationReturnType<SellItem[]> =
        await this.reportService.getItem(page, limit, from, to);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.SELL_REPORT_PART as string])
  @ApiOperation({ summary: 'Get All Item' })
  @ApiResponse({ status: 200, description: 'Item retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('item/information')
  async getItemInformation(
    @Req() req: Request,
    @Res() res: Response,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<any>> {
    try {
      let data: any = await this.reportService.getItemInformation(from, to);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.SELL_REPORT_PART as string])
  @ApiOperation({ summary: 'Get All Item' })
  @ApiResponse({ status: 200, description: 'Item retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('item_search')
  async getItemSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<SellItem[]>> {
    try {
      let data: SellItem[] = await this.reportService.getItemSearch(search);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.SELL_REPORT_PART as string])
  @ApiOperation({ summary: 'Get All Item' })
  @ApiResponse({ status: 200, description: 'Item retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('item_search/information')
  async getItemInformationSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<any>> {
    try {
      let data: any = await this.reportService.getItemInformationSearch(search);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.SELL_REPORT_PART as string])
  @ApiOperation({ summary: 'Get All Item' })
  @ApiResponse({ status: 200, description: 'Item retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('item/print')
  async itemPrint(
    @Req() req: Request,
    @Res() res: Response,
    @Query('from') from: From,
    @Query('to') to: To,
    @Query('search') search: Search,
  ): Promise<Response<void>> {
    try {
      await this.reportService.itemPrint(search, from, to, res);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  //KOGA ALL REPORT

  @PartName([ENUMs.KOGA_REPORT_PART as string])
  @ApiOperation({ summary: 'Get All Item' })
  @ApiResponse({ status: 200, description: 'Item retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('koga_all')
  async getKogaAll(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<Item[]>>> {
    try {
      let data: PaginationReturnType<Item[]> =
        await this.reportService.getKogaAll(page, limit, from, to);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.KOGA_REPORT_PART as string])
  @ApiOperation({ summary: 'Get All Item' })
  @ApiResponse({ status: 200, description: 'Item retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('koga_all/information')
  async getKogaAllInformation(
    @Req() req: Request,
    @Res() res: Response,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<any>> {
    try {
      let data: any = await this.reportService.getKogaAllInformation(from, to);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  //test
  @PartName([ENUMs.KOGA_REPORT_PART as string])
  @ApiOperation({ summary: 'Get All Item' })
  @ApiResponse({ status: 200, description: 'Item retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('koga_all_search')
  async getKogaAllSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<Item[]>> {
    try {
      let data: Item[] = await this.reportService.getKogaAllSearch(search);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.KOGA_REPORT_PART as string])
  @ApiOperation({ summary: 'Get All Item' })
  @ApiResponse({ status: 200, description: 'Item retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('koga_all_search/information')
  async getKogaAllInformationSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<any>> {
    try {
      let data: any =
        await this.reportService.getKogaAllInformationSearch(search);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.KOGA_REPORT_PART as string])
  @ApiOperation({ summary: 'Get All Item' })
  @ApiResponse({ status: 200, description: 'Item retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  @HttpCode(HttpStatus.OK)
  @Get('koga_all/print')
  async kogaAllPrint(
    @Req() req: Request,
    @Res() res: Response,
    @Query('from') from: From,
    @Query('to') to: To,
    @Query('search') search: Search,
  ): Promise<Response<void>> {
    try {
      await this.reportService.kogaAllPrint(search, from, to, res);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
