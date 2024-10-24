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
import { ReservationService } from './reservation.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PartGuard } from 'src/auth/part.guard';
import { PartName } from 'src/auth/part.decorator';
import { ENUMs } from 'lib/enum';
import { Request, Response } from 'express';
import { PanelReservation } from 'src/types/reservation';
import { Reservation } from 'database/types';
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
import CreateReservationDto from './dto/create-reservation.dto';
import UpdateReservationDto from './dto/update-reservation.dto';
import CreateReservationMobileDto from './dto/create-reservation-mobile.dto';

@UseGuards(AuthGuard, PartGuard)
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @PartName([ENUMs.RESERVATION_PART as string])
  @Get('panel')
  async getPanel(
    @Req() req: Request,
    @Res() res: Response,
    @Query('date') date: Date,
  ): Promise<Response<PanelReservation[]>> {
    try {
      let reservations: PanelReservation[] =
        await this.reservationService.getPanel(date);
      return res.status(HttpStatus.OK).json(reservations);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.RESERVATION_PART as string])
  @Get('')
  async getAll(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('date') date: Date,
    @Query('filter') filter: Filter,
    @Query('colorFilter') colorFilter: Filter,
    @Query('carModelFilter') carModelFilter: Filter,
    @Query('carTypeFilter') carTypeFilter: Filter,
    @Query('serviceFilter') serviceFilter: Filter,
    @Query('userFilter') userFilter: Filter,
  ): Promise<Response<PaginationReturnType<Reservation[]>>> {
    try {
      let reservations: PaginationReturnType<Reservation[]> =
        await this.reservationService.getAll(
          page,
          limit,
          date,
          filter,
          colorFilter,
          carModelFilter,
          carTypeFilter,
          serviceFilter,
          userFilter,
        );
      return res.status(HttpStatus.OK).json(reservations);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.RESERVATION_PART as string])
  @Get('/deleted')
  async getAllDeleted(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('from') from: From,
    @Query('to') to: To,
    @Query('filter') filter: Filter,
    @Query('colorFilter') colorFilter: Filter,
    @Query('carModelFilter') carModelFilter: Filter,
    @Query('carTypeFilter') carTypeFilter: Filter,
    @Query('serviceFilter') serviceFilter: Filter,
    @Query('userFilter') userFilter: Filter,
  ): Promise<Response<PaginationReturnType<Reservation[]>>> {
    try {
      let reservations: PaginationReturnType<Reservation[]> =
        await this.reservationService.getAllDeleted(
          page,
          limit,
          from,
          to,
          filter,
          colorFilter,
          carModelFilter,
          carTypeFilter,
          serviceFilter,
          userFilter,
        );
      return res.status(HttpStatus.OK).json(reservations);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.RESERVATION_PART as string])
  @Get('/search')
  async search(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
    @Query('date') date: Date,
  ): Promise<Response<Reservation[]>> {
    try {
      let reservations: Reservation[] = await this.reservationService.search(
        search,
        date,
      );
      return res.status(HttpStatus.OK).json(reservations);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.RESERVATION_PART as string])
  @Get('/deleted_search')
  async deletedSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<Reservation[]>> {
    try {
      let reservations: Reservation[] =
        await this.reservationService.deletedSearch(search);
      return res.status(HttpStatus.OK).json(reservations);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.RESERVATION_PART as string])
  @Get(':id')
  async getOne(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: Id,
  ): Promise<Response<Reservation>> {
    try {
      let reservation: Reservation = await this.reservationService.findOne(id);
      return res.status(HttpStatus.OK).json(reservation);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.RESERVATION_PART as string])
  @Post('')
  @UsePipes(new ValidationPipe())
  async create(
    @Body() body: CreateReservationDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Reservation>> {
    try {
      const reservation: Reservation = await this.reservationService.create(
        body,
        req['user'].id,
      );
      return res.status(HttpStatus.OK).json(reservation);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.RESERVATION_PART as string])
  @Post('mobile/:service_id')
  @UsePipes(new ValidationPipe())
  async createMobile(
    @Param('service_id', ParseIntPipe) service_id: Id,

    @Body() body: CreateReservationMobileDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Reservation>> {
    try {
      const reservation: Reservation =
        await this.reservationService.createMobile(
          service_id,
          body,
          req['user'].id,
        );
      return res.status(HttpStatus.OK).json(reservation);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.RESERVATION_PART as string])
  @Put('/restore/:id')
  async restore(
    @Param('id', ParseIntPipe) id: Id,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Id>> {
    try {
      const reservation: Id = await this.reservationService.restore(id);
      return res.status(HttpStatus.OK).json(reservation);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.RESERVATION_PART as string])
  @Put('/complete/:id/:complete')
  async complete(
    @Param('id', ParseIntPipe) id: Id,
    @Param('complete') complete: boolean,

    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Id>> {
    try {
      const reservation: Id = await this.reservationService.complete(
        id,
        complete,
      );
      return res.status(HttpStatus.OK).json(reservation);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.RESERVATION_PART as string])
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', ParseIntPipe) id: Id,
    @Body() body: UpdateReservationDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Reservation>> {
    try {
      const reservation: Reservation = await this.reservationService.update(
        id,
        body,
        req['user'].id,
      );
      return res.status(HttpStatus.OK).json(reservation);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.RESERVATION_PART as string])
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: Id,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Id>> {
    try {
      const reservation: Id = await this.reservationService.delete(id);
      return res.status(HttpStatus.OK).json(reservation);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
