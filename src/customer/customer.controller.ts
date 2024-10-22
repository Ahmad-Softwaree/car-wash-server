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
import { CustomerService } from './customer.service';
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
import { Customer } from 'database/types';
import { PartGuard } from 'src/auth/part.guard';
import { PartName } from 'src/auth/part.decorator';
import { ENUMs } from 'lib/enum';
import CreateCustomerDto from './dto/create-customer-dto';
import UpdateCustomerDto from './dto/update-customer-dto';

@UseGuards(AuthGuard, PartGuard)
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}
  @PartName([ENUMs.CUSTOMERS_PART as string])
  @Get('')
  async getAll(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<Customer[]>>> {
    try {
      let customers: PaginationReturnType<Customer[]> =
        await this.customerService.getAll(page, limit, from, to);
      return res.status(HttpStatus.OK).json(customers);
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
  ): Promise<Response<Customer[]>> {
    try {
      let customers: Customer[] = await this.customerService.getSelect();
      return res.status(HttpStatus.OK).json(customers);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CUSTOMERS_PART as string])
  @Get('/deleted')
  async getAllDeleted(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<Customer[]>>> {
    try {
      let customers: PaginationReturnType<Customer[]> =
        await this.customerService.getAllDeleted(page, limit, from, to);
      return res.status(HttpStatus.OK).json(customers);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CUSTOMERS_PART as string])
  @Get('/search')
  async search(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<Customer[]>> {
    try {
      let customers: Customer[] = await this.customerService.search(search);
      return res.status(HttpStatus.OK).json(customers);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CUSTOMERS_PART as string])
  @Get('/deleted_search')
  async deletedSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<Customer[]>> {
    try {
      let customers: Customer[] =
        await this.customerService.deletedSearch(search);
      return res.status(HttpStatus.OK).json(customers);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CUSTOMERS_PART as string])
  @Get(':id')
  async getOne(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: Id,
  ): Promise<Response<Customer>> {
    try {
      let customer: Customer = await this.customerService.findOne(id);
      return res.status(HttpStatus.OK).json(customer);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CUSTOMERS_PART as string])
  @Post('')
  @UsePipes(new ValidationPipe())
  async create(
    @Body() body: CreateCustomerDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Customer>> {
    try {
      const customer: Customer = await this.customerService.create(
        body,
        req['user'].id,
      );
      return res.status(HttpStatus.OK).json(customer);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CUSTOMERS_PART as string])
  @Put('/restore/:id')
  async restore(
    @Param('id', ParseIntPipe) id: Id,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Id>> {
    try {
      const customer: Id = await this.customerService.restore(id);
      return res.status(HttpStatus.OK).json(customer);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CUSTOMERS_PART as string])
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', ParseIntPipe) id: Id,
    @Body() body: UpdateCustomerDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Customer>> {
    try {
      const customer: Customer = await this.customerService.update(
        id,
        body,
        req['user'].id,
      );
      return res.status(HttpStatus.OK).json(customer);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.CUSTOMERS_PART as string])
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: Id,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Id>> {
    try {
      const customer: Id = await this.customerService.delete(id);
      return res.status(HttpStatus.OK).json(customer);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
