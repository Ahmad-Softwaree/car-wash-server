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
import { PrinterService } from './printer.service';
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

import { Printer } from 'database/types';
import CreatePrinterDto from './dto/create-printer.dto';
import UpdatePrinterDto from './dto/update-printer.dto';

@UseGuards(AuthGuard, PartGuard)
@Controller('printer')
export class PrinterController {
  constructor(private readonly printerService: PrinterService) {}
  @PartName([ENUMs.PRINTER_PART as string])
  @Get('')
  async getAll(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<Printer[]>>> {
    try {
      let printers: PaginationReturnType<Printer[]> =
        await this.printerService.getAll(page, limit, from, to);
      return res.status(HttpStatus.OK).json(printers);
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
  ): Promise<Response<Printer[]>> {
    try {
      let printers: Printer[] = await this.printerService.getSelect();
      return res.status(HttpStatus.OK).json(printers);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.PRINTER_PART as string])
  @Get('/deleted')
  async getAllDeleted(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<Printer[]>>> {
    try {
      let printers: PaginationReturnType<Printer[]> =
        await this.printerService.getAllDeleted(page, limit, from, to);
      return res.status(HttpStatus.OK).json(printers);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.PRINTER_PART as string])
  @Get('/search')
  async search(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<Printer[]>> {
    try {
      let printers: Printer[] = await this.printerService.search(search);
      return res.status(HttpStatus.OK).json(printers);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.PRINTER_PART as string])
  @Get('/deleted_search')
  async deletedSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<Printer[]>> {
    try {
      let printers: Printer[] = await this.printerService.deletedSearch(search);
      return res.status(HttpStatus.OK).json(printers);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.PRINTER_PART as string])
  @Post('')
  @UsePipes(new ValidationPipe())
  async create(
    @Body() body: CreatePrinterDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Printer>> {
    try {
      const printer: Printer = await this.printerService.create(body);
      return res.status(HttpStatus.OK).json(printer);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.PRINTER_PART as string])
  @Put('/restore/:id')
  async restore(
    @Param('id', ParseIntPipe) id: Id,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Id>> {
    try {
      const printer: Id = await this.printerService.restore(id);
      return res.status(HttpStatus.OK).json(printer);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.PRINTER_PART as string])
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', ParseIntPipe) id: Id,
    @Body() body: UpdatePrinterDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Printer>> {
    try {
      const printer: Printer = await this.printerService.update(id, body);
      return res.status(HttpStatus.OK).json(printer);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.PRINTER_PART as string])
  @Put('state/:id')
  @UsePipes(new ValidationPipe())
  async updateState(
    @Param('id', ParseIntPipe) id: Id,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Printer>> {
    try {
      const printer: Printer = await this.printerService.updateState(id);
      return res.status(HttpStatus.OK).json(printer);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.PRINTER_PART as string])
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: Id,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Id>> {
    try {
      const printer: Id = await this.printerService.delete(id);
      return res.status(HttpStatus.OK).json(printer);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
