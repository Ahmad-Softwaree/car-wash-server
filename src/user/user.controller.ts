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
import { UserService } from './user.service';
import { Request, Response } from 'express';

import CreateUserDto from './dto/create-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import { UserWithRole, UserWithRoleAndPart } from 'src/types/auth';
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
import { User } from 'database/types';
import { PartGuard } from 'src/auth/part.guard';
import { PartName } from 'src/auth/part.decorator';
import { ENUMs } from 'lib/enum';

@UseGuards(AuthGuard, PartGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @PartName(['all'])
  @Get('/select')
  async getSelect(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<User[]>> {
    try {
      let customers: User[] = await this.userService.getSelect();
      return res.status(HttpStatus.OK).json(customers);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @PartName([ENUMs.USERS_PART as string])
  @Get('')
  async getAll(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('filter') filter: Filter,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<UserWithRoleAndPart[]>>> {
    try {
      let users: PaginationReturnType<UserWithRoleAndPart[]> =
        await this.userService.getAll(page, limit, filter, from, to);
      return res.status(HttpStatus.OK).json(users);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.USERS_PART as string])
  @Get('/deleted')
  async getAllDeleted(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: Page,
    @Query('limit') limit: Limit,
    @Query('filter') filter: Filter,
    @Query('from') from: From,
    @Query('to') to: To,
  ): Promise<Response<PaginationReturnType<UserWithRoleAndPart[]>>> {
    try {
      let users: PaginationReturnType<UserWithRoleAndPart[]> =
        await this.userService.getAllDeleted(page, limit, filter, from, to);
      return res.status(HttpStatus.OK).json(users);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.USERS_PART as string])
  @Get('/search')
  async search(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<UserWithRoleAndPart[]>> {
    try {
      let users: UserWithRoleAndPart[] = await this.userService.search(search);
      return res.status(HttpStatus.OK).json(users);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.USERS_PART as string])
  @Get('/deleted_search')
  async deletedSearch(
    @Req() req: Request,
    @Res() res: Response,
    @Query('search') search: Search,
  ): Promise<Response<UserWithRoleAndPart[]>> {
    try {
      let users: UserWithRoleAndPart[] =
        await this.userService.deletedSearch(search);
      return res.status(HttpStatus.OK).json(users);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.USERS_PART as string])
  @Get(':id')
  async getOne(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: Id,
  ): Promise<Response<UserWithRoleAndPart>> {
    try {
      let user: UserWithRoleAndPart = await this.userService.findOne(id);
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
  @PartName([ENUMs.USERS_PART as string])
  @Post('')
  @UsePipes(new ValidationPipe())
  async create(
    @Body() body: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<User>> {
    try {
      const user: User = await this.userService.create(body);
      return res.status(HttpStatus.OK).json(user);
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
      const user: Id = await this.userService.restore(id);
      return res.status(HttpStatus.OK).json(user);
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
    @Body() body: UpdateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response<UserWithRole>> {
    try {
      const user: UserWithRole = await this.userService.update(id, body);
      return res.status(HttpStatus.OK).json(user);
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
      const user: Id = await this.userService.delete(id, req);
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
