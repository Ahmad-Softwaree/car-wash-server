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
import { ExpenseTypeService } from './expense-type.service';
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

import CreateExpenseTypeDto from './dto/create-expense-type.dto';
import UpdateExpenseTypeDto from './dto/update-expense-type.dto';
import { ExpenseType } from 'database/types';

@UseGuards(AuthGuard, PartGuard)
@Controller('expense-type')
export class ExpenseTypeController {
  constructor(private readonly expenseTypeService: ExpenseTypeService) {}
  @PartName([ENUMs.EXPENSE_TYPE_PART as string])
  @Get('')
  async getAll(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<ExpenseType[]>>> {
    try {
      let expenseTypes: PaginationReturnType<ExpenseType[]> =
        await this.expenseTypeService.getAll(page, limit, from, to);
      return res.status(HttpStatus.OK).json(expenseTypes);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.EXPENSE_TYPE_PART as string, ENUMs.EXPENSES_PART as string])
  @Get('/select')
  async getSelect(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<ExpenseType[]>> {
    try {
      let expenseTypes: ExpenseType[] =
        await this.expenseTypeService.getSelect();
      return res.status(HttpStatus.OK).json(expenseTypes);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.EXPENSE_TYPE_PART as string])
  @Get('/deleted')
  async getAllDeleted(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<ExpenseType[]>>> {
    try {
      let expenseTypes: PaginationReturnType<ExpenseType[]> =
        await this.expenseTypeService.getAllDeleted(page, limit, from, to);
      return res.status(HttpStatus.OK).json(expenseTypes);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.EXPENSE_TYPE_PART as string])
  @Get('/search')
  async search(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<ExpenseType[]>> {
    try {
      let expenseTypes: ExpenseType[] =
        await this.expenseTypeService.search(search);
      return res.status(HttpStatus.OK).json(expenseTypes);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.EXPENSE_TYPE_PART as string])
  @Get('/deleted_search')
  async deletedSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<ExpenseType[]>> {
    try {
      let expenseTypes: ExpenseType[] =
        await this.expenseTypeService.deletedSearch(search);
      return res.status(HttpStatus.OK).json(expenseTypes);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.EXPENSE_TYPE_PART as string])
  @Post('')
  @UsePipes(new ValidationPipe())
  async create(
    @Body() body: CreateExpenseTypeDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<ExpenseType>> {
    try {
      const expenseType: ExpenseType =
        await this.expenseTypeService.create(body);
      return res.status(HttpStatus.OK).json(expenseType);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.EXPENSE_TYPE_PART as string])
  @Put('/restore/:id')
  async restore(
    @Param('id', ParseIntPipe) id: Id,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Id>> {
    try {
      const expenseType: Id = await this.expenseTypeService.restore(id);
      return res.status(HttpStatus.OK).json(expenseType);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.EXPENSE_TYPE_PART as string])
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', ParseIntPipe) id: Id,
    @Body() body: UpdateExpenseTypeDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<ExpenseType>> {
    try {
      const expenseType: ExpenseType = await this.expenseTypeService.update(
        id,
        body,
      );
      return res.status(HttpStatus.OK).json(expenseType);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.EXPENSE_TYPE_PART as string])
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: Id,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Id>> {
    try {
      const expenseType: Id = await this.expenseTypeService.delete(id);
      return res.status(HttpStatus.OK).json(expenseType);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
