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
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PartService } from './part.service';
import { Request, Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { Part } from 'database/types';
import { Id } from 'src/types/global';
import { CreatePartDto } from './dto/create-part.dto';
import { UpdatePartDto } from './dto/update-part.dto';
import { PartGuard } from 'src/auth/part.guard';
import { PartName } from 'src/auth/part.decorator';
import { ENUMs } from 'lib/enum';

@UseGuards(AuthGuard, PartGuard)
@Controller('part')
export class PartController {
  constructor(private readonly partService: PartService) {}
  @PartName([ENUMs.USERS_PART as string])
  @Get()
  async getAll(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Part[]>> {
    try {
      const parts: Part[] = await this.partService.getAll();
      return res.status(HttpStatus.OK).json(parts);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.USERS_PART as string])
  @Post()
  @UsePipes(new ValidationPipe())
  async create(
    @Body() body: CreatePartDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Part>> {
    try {
      const part: Part = await this.partService.create(body);
      return res.status(HttpStatus.OK).json(part);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.USERS_PART as string])
  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', ParseIntPipe) id: Id,
    @Body() body: UpdatePartDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Part>> {
    try {
      const part: Part = await this.partService.update(id, body);
      return res.status(HttpStatus.OK).json(part);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.USERS_PART as string])
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: Id,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<Id>> {
    try {
      const part: Id = await this.partService.delete(id);
      return res.status(HttpStatus.OK).json(part);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
