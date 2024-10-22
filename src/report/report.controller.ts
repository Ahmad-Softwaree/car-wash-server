import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PartGuard } from 'src/auth/part.guard';
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
import {
  Expense,
  Item,
  ItemQuantityHistory,
  Reservation,
  Sell,
  SellItem,
} from 'database/types';
import {
  BillProfitReportInfo,
  CaseReport,
  CaseReportInfo,
  ExpenseReportInfo,
  GlobalCaseInfo,
  ItemProfitReportInfo,
  ItemReportInfo,
  KogaAllReportInfo,
  KogaLessReportInfo,
  KogaMovementReportInfo,
  KogaNullReportInfo,
  ReservationReportInfo,
  SellReportData,
  SellReportInfo,
} from 'src/types/report';

@UseGuards(AuthGuard, PartGuard)
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
  //SELL REPORT
  @PartName([ENUMs.SELL_REPORT_PART as string])
  @Get('sell')
  async getSell(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('from') from: From,
    @Query('to') to: To,
    @Query('userFilter') userFilter: Filter,
  ): Promise<Response<PaginationReturnType<Sell[]>>> {
    try {
      let data: PaginationReturnType<Sell[]> = await this.reportService.getSell(
        page,
        limit,
        from,
        to,
        userFilter,
      );
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.SELL_REPORT_PART as string])
  @Get('sell/information')
  async getSellInformation(
    @Req() req: Request,
    @Res() res: Response,
    @Query('from') from: From,
    @Query('to') to: To,
    @Query('userFilter') userFilter: Filter,
  ): Promise<Response<SellReportInfo>> {
    try {
      let data: SellReportInfo = await this.reportService.getSellInformation(
        from,
        to,
        userFilter,
      );
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.SELL_REPORT_PART as string])
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
  @Get('sell_search/information')
  async getSellInformationSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<SellReportInfo>> {
    try {
      let data: SellReportInfo =
        await this.reportService.getSellInformationSearch(search);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CREATE_PSULA_PART as string, ENUMs.SELL_PART as string])
  @Post('sell/print')
  async sellPrintData(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
    @Query('from') from: From,
    @Query('to') to: To,
    @Query('userFilter') userFilter: Filter,
  ): Promise<
    Response<{
      sell: SellReportData[];
      info: SellReportInfo;
    }>
  > {
    try {
      let data: {
        sell: SellReportData[];
        info: SellReportInfo;
      } = await this.reportService.sellPrintData(search, from, to, userFilter);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  //ITEM REPORT

  @PartName([ENUMs.SELL_REPORT_PART as string])
  @Get('item')
  async getItem(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('filter') filter: Filter,
    @Query('from') from: From,
    @Query('to') to: To,
    @Query('userFilter') userFilter: Filter,
  ): Promise<Response<PaginationReturnType<SellItem[]>>> {
    try {
      let data: PaginationReturnType<SellItem[]> =
        await this.reportService.getItem(
          page,
          limit,
          filter,
          from,
          to,
          userFilter,
        );
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.SELL_REPORT_PART as string])
  @Get('item/information')
  async getItemInformation(
    @Req() req: Request,
    @Res() res: Response,
    @Query('filter') filter: Filter,

    @Query('from') from: From,
    @Query('to') to: To,
    @Query('userFilter') userFilter: Filter,
  ): Promise<Response<ItemReportInfo>> {
    try {
      let data: ItemReportInfo = await this.reportService.getItemInformation(
        filter,
        from,
        to,
        userFilter,
      );
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.SELL_REPORT_PART as string])
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
  @Get('item_search/information')
  async getItemInformationSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<ItemReportInfo>> {
    try {
      let data: ItemReportInfo =
        await this.reportService.getItemInformationSearch(search);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  //KOGA ALL REPORT

  @PartName([ENUMs.KOGA_REPORT_PART as string])
  @Get('koga_all')
  async getKogaAll(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('filter') filter: Filter,
    @Query('userFilter') userFilter: Filter,
  ): Promise<Response<PaginationReturnType<Item[]>>> {
    try {
      let data: PaginationReturnType<Item[]> =
        await this.reportService.getKogaAll(page, limit, filter, userFilter);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.KOGA_REPORT_PART as string])
  @Get('koga_all/information')
  async getKogaAllInformation(
    @Req() req: Request,
    @Res() res: Response,
    @Query('filter') filter: Filter,
    @Query('userFilter') userFilter: Filter,
  ): Promise<Response<KogaAllReportInfo>> {
    try {
      let data: KogaAllReportInfo =
        await this.reportService.getKogaAllInformation(filter, userFilter);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.KOGA_REPORT_PART as string])
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
  @Get('koga_all_search/information')
  async getKogaAllInformationSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<KogaAllReportInfo>> {
    try {
      let data: KogaAllReportInfo =
        await this.reportService.getKogaAllInformationSearch(search);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  //KOGA NULL REPORT

  @PartName([ENUMs.KOGA_REPORT_PART as string])
  @Get('koga_null')
  async getKogaNull(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('filter') filter: Filter,
    @Query('limit') limit: Limit,
    @Query('userFilter') userFilter: Filter,
  ): Promise<Response<PaginationReturnType<Item[]>>> {
    try {
      let data: PaginationReturnType<Item[]> =
        await this.reportService.getKogaNull(page, limit, filter, userFilter);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.KOGA_REPORT_PART as string])
  @Get('koga_null/information')
  async getKogaNullInformation(
    @Req() req: Request,
    @Res() res: Response,
    @Query('filter') filter: Filter,
    @Query('userFilter') userFilter: Filter,
  ): Promise<Response<KogaNullReportInfo>> {
    try {
      let data: KogaNullReportInfo =
        await this.reportService.getKogaNullInformation(filter, userFilter);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  //test
  @PartName([ENUMs.KOGA_REPORT_PART as string])
  @Get('koga_null_search')
  async getKogaNullSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<Item[]>> {
    try {
      let data: Item[] = await this.reportService.getKogaNullSearch(search);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.KOGA_REPORT_PART as string])
  @Get('koga_null_search/information')
  async getKogaNullInformationSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<KogaNullReportInfo>> {
    try {
      let data: KogaNullReportInfo =
        await this.reportService.getKogaNullInformationSearch(search);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  //KOGA LESS REPORT

  @PartName([ENUMs.KOGA_REPORT_PART as string])
  @Get('koga_less')
  async getKogaLess(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('filter') filter: Filter,
    @Query('limit') limit: Limit,
    @Query('userFilter') userFilter: Filter,
  ): Promise<Response<PaginationReturnType<Item[]>>> {
    try {
      let data: PaginationReturnType<Item[]> =
        await this.reportService.getKogaLess(page, limit, filter, userFilter);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.KOGA_REPORT_PART as string])
  @Get('koga_less/information')
  async getKogaLessInformation(
    @Req() req: Request,
    @Res() res: Response,
    @Query('filter') filter: Filter,
    @Query('userFilter') userFilter: Filter,
  ): Promise<Response<KogaLessReportInfo>> {
    try {
      let data: KogaLessReportInfo =
        await this.reportService.getKogaLessInformation(filter, userFilter);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  //test
  @PartName([ENUMs.KOGA_REPORT_PART as string])
  @Get('koga_less_search')
  async getKogaLessSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<Item[]>> {
    try {
      let data: Item[] = await this.reportService.getKogaLessSearch(search);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.KOGA_REPORT_PART as string])
  @Get('koga_less_search/information')
  async getKogaLessInformationSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<KogaLessReportInfo>> {
    try {
      let data: KogaLessReportInfo =
        await this.reportService.getKogaLessInformationSearch(search);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  //KOGA MOVEMENT REPORT

  @PartName([ENUMs.KOGA_REPORT_PART as string])
  @Get('koga_movement')
  async getKogaMovement(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('filter') filter: Filter,

    @Query('from') from: From,
    @Query('to') to: To,
    @Query('userFilter') userFilter: Filter,
  ): Promise<Response<PaginationReturnType<ItemQuantityHistory[]>>> {
    try {
      let data: PaginationReturnType<ItemQuantityHistory[]> =
        await this.reportService.getKogaMovement(
          page,
          limit,
          filter,
          from,
          to,
          userFilter,
        );
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.KOGA_REPORT_PART as string])
  @Get('koga_movement/information')
  async getKogaMovementInformation(
    @Req() req: Request,
    @Res() res: Response,
    @Query('filter') filter: Filter,

    @Query('from') from: From,
    @Query('to') to: To,
    @Query('userFilter') userFilter: Filter,
  ): Promise<Response<KogaMovementReportInfo>> {
    try {
      let data: KogaMovementReportInfo =
        await this.reportService.getKogaMovementInformation(
          filter,
          from,
          to,
          userFilter,
        );
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  //test
  @PartName([ENUMs.KOGA_REPORT_PART as string])
  @Get('koga_movement_search')
  async getKogaMovementSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<ItemQuantityHistory[]>> {
    try {
      let data: ItemQuantityHistory[] =
        await this.reportService.getKogaMovementSearch(search);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.KOGA_REPORT_PART as string])
  @Get('koga_movement_search/information')
  async getKogaMovementInformationSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<KogaMovementReportInfo>> {
    try {
      let data: KogaMovementReportInfo =
        await this.reportService.getKogaMovementInformationSearch(search);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  //BILL PROFIT REPORT
  @PartName([ENUMs.PROFIT_REPORT_PART as string])
  @Get('bill_profit')
  async getBillProfit(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('from') from: From,
    @Query('to') to: To,
    @Query('userFilter') userFilter: Filter,
  ): Promise<Response<PaginationReturnType<Sell[]>>> {
    try {
      let data: PaginationReturnType<Sell[]> =
        await this.reportService.getBillProfit(
          page,
          limit,
          from,
          to,
          userFilter,
        );
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.PROFIT_REPORT_PART as string])
  @Get('bill_profit/information')
  async getBillProfitInformation(
    @Req() req: Request,
    @Res() res: Response,
    @Query('from') from: From,
    @Query('to') to: To,
    @Query('userFilter') userFilter: Filter,
  ): Promise<Response<BillProfitReportInfo>> {
    try {
      let data: BillProfitReportInfo =
        await this.reportService.getBillProfitInformation(from, to, userFilter);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.PROFIT_REPORT_PART as string])
  @Get('bill_profit_search')
  async getBillProfitSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<Sell[]>> {
    try {
      let data: Sell[] = await this.reportService.getBillProfitSearch(search);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.PROFIT_REPORT_PART as string])
  @Get('bill_profit_search/information')
  async getBillProfitInformationSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<BillProfitReportInfo>> {
    try {
      let data: BillProfitReportInfo =
        await this.reportService.getBillProfitInformationSearch(search);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  //ITEM_PROFIT

  @PartName([ENUMs.PROFIT_REPORT_PART as string])
  @Get('item_profit')
  async getItemProfit(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('filter') filter: Filter,
    @Query('from') from: From,
    @Query('to') to: To,
    @Query('userFilter') userFilter: Filter,
  ): Promise<Response<PaginationReturnType<SellItem[]>>> {
    try {
      let data: PaginationReturnType<SellItem[]> =
        await this.reportService.getItemProfit(
          page,
          limit,
          filter,
          from,
          to,
          userFilter,
        );
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.PROFIT_REPORT_PART as string])
  @Get('item_profit/information')
  async getItemProfitInformation(
    @Req() req: Request,
    @Res() res: Response,
    @Query('filter') filter: Filter,

    @Query('from') from: From,
    @Query('to') to: To,
    @Query('userFilter') userFilter: Filter,
  ): Promise<Response<ItemProfitReportInfo>> {
    try {
      let data: ItemProfitReportInfo =
        await this.reportService.getItemProfitInformation(
          filter,
          from,
          to,
          userFilter,
        );
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.PROFIT_REPORT_PART as string])
  @Get('item_profit_search')
  async getItemProfitSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<SellItem[]>> {
    try {
      let data: SellItem[] =
        await this.reportService.getItemProfitSearch(search);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.PROFIT_REPORT_PART as string])
  @Get('item_profit_search/information')
  async getItemProfitInformationSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<ItemProfitReportInfo>> {
    try {
      let data: ItemProfitReportInfo =
        await this.reportService.getItemProfitInformationSearch(search);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  //EXPENSE REPORT

  @PartName([ENUMs.EXPENSE_REPORT_PART as string])
  @Get('expense')
  async getExpense(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('filter') filter: Filter,
    @Query('from') from: From,
    @Query('to') to: To,
    @Query('userFilter') userFilter: Filter,
  ): Promise<Response<PaginationReturnType<Expense[]>>> {
    try {
      let data: PaginationReturnType<Expense[]> =
        await this.reportService.getExpense(
          page,
          limit,
          filter,
          from,
          to,
          userFilter,
        );
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.EXPENSE_REPORT_PART as string])
  @Get('expense/information')
  async getExpenseInformation(
    @Req() req: Request,
    @Res() res: Response,
    @Query('filter') filter: Filter,

    @Query('from') from: From,
    @Query('to') to: To,
    @Query('userFilter') userFilter: Filter,
  ): Promise<Response<ExpenseReportInfo>> {
    try {
      let data: ExpenseReportInfo =
        await this.reportService.getExpenseInformation(
          filter,
          from,
          to,
          userFilter,
        );
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.EXPENSE_REPORT_PART as string])
  @Get('expense_search')
  async getExpenseSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<Expense[]>> {
    try {
      let data: Expense[] = await this.reportService.getExpenseSearch(search);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.EXPENSE_REPORT_PART as string])
  @Get('expense_search/information')
  async getExpenseInformationSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<ExpenseReportInfo>> {
    try {
      let data: ExpenseReportInfo =
        await this.reportService.getExpenseInformationSearch(search);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  //CASE REPORT
  @PartName([ENUMs.CASE_REPORT_PART as string])
  @Get('case')
  async getCase(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('from') from: From,
    @Query('to') to: To,
    @Query('userFilter') userFilter: Filter,
  ): Promise<Response<PaginationReturnType<CaseReport[]>>> {
    try {
      let data: PaginationReturnType<CaseReport[]> =
        await this.reportService.getCase(page, limit, from, to, userFilter);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.CASE_REPORT_PART as string])
  @Get('case/information')
  async getCaseInformation(
    @Req() req: Request,
    @Res() res: Response,
    @Query('from') from: From,
    @Query('to') to: To,
    @Query('userFilter') userFilter: Filter,
  ): Promise<Response<CaseReportInfo>> {
    try {
      let data: CaseReportInfo = await this.reportService.getCaseInformation(
        from,
        to,
        userFilter,
      );
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.CASE_REPORT_PART as string])
  @Get('case_search')
  async getCaseSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<CaseReport[]>> {
    try {
      let data: CaseReport[] = await this.reportService.getCaseSearch(search);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.CASE_REPORT_PART as string])
  @Get('case_search/information')
  async getCaseInformationSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<CaseReportInfo>> {
    try {
      let data: CaseReportInfo =
        await this.reportService.getCaseInformationSearch(search);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  //GLOBAL CASE DATA

  @PartName([ENUMs.CASE_REPORT_PART as string])
  @Get('case/global')
  async getGlobalCaseInfo(
    @Req() req: Request,
    @Res() res: Response,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<GlobalCaseInfo>> {
    try {
      let data: GlobalCaseInfo = await this.reportService.getGlobalCaseInfo(
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

  //RESERVATION REPORT
  @PartName([ENUMs.RESERVATION_REPORT_PART as string])
  @Get('reservation')
  async getReservation(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('from') from: From,
    @Query('to') to: To,
    @Query('colorFilter') colorFilter: Filter,
    @Query('carModelFilter') carModelFilter: Filter,
    @Query('carTypeFilter') carTypeFilter: Filter,
    @Query('serviceFilter') serviceFilter: Filter,
    @Query('userFilter') userFilter: Filter,
  ): Promise<Response<PaginationReturnType<Reservation[]>>> {
    try {
      let data: PaginationReturnType<Reservation[]> =
        await this.reportService.getReservation(
          page,
          limit,
          from,
          to,
          colorFilter,
          carModelFilter,
          carTypeFilter,
          serviceFilter,
          userFilter,
        );
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.RESERVATION_REPORT_PART as string])
  @Get('reservation/information')
  async getReservationInformation(
    @Req() req: Request,
    @Res() res: Response,
    @Query('from') from: From,
    @Query('to') to: To,
    @Query('colorFilter') colorFilter: Filter,
    @Query('carModelFilter') carModelFilter: Filter,
    @Query('carTypeFilter') carTypeFilter: Filter,
    @Query('serviceFilter') serviceFilter: Filter,
    @Query('userFilter') userFilter: Filter,
  ): Promise<Response<ReservationReportInfo>> {
    try {
      let data: ReservationReportInfo =
        await this.reportService.getReservationInformation(
          from,
          to,
          colorFilter,
          carModelFilter,
          carTypeFilter,
          serviceFilter,
          userFilter,
        );
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.RESERVATION_REPORT_PART as string])
  @Get('reservation_search')
  async getReservationSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<Reservation[]>> {
    try {
      let data: Reservation[] =
        await this.reportService.getReservationSearch(search);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.RESERVATION_REPORT_PART as string])
  @Get('reservation_search/information')
  async getReservationInformationSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<ReservationReportInfo>> {
    try {
      let data: ReservationReportInfo =
        await this.reportService.getReservationInformationSearch(search);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
