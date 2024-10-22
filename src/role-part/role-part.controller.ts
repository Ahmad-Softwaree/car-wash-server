import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RolePartService } from './role-part.service';
import { Request, Response } from 'express';
import { RolePart } from 'database/types';
import { RoleWithPartJoin } from 'src/types/role-part';
import { AuthGuard } from 'src/auth/auth.guard';
import { PartGuard } from 'src/auth/part.guard';
import { PartName } from 'src/auth/part.decorator';
import { ENUMs } from 'lib/enum';

@UseGuards(AuthGuard, PartGuard)
@Controller('role-part')
export class RolePartController {
  constructor(private readonly rolePartService: RolePartService) {}
  @PartName([ENUMs.USERS_PART as string, ENUMs.ROLES_PART as string])
  @Get('role/:id')
  async getRoleParts(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Response<RolePart[]>> {
    try {
      let roleParts: RoleWithPartJoin[] =
        await this.rolePartService.findRoleParts(id);
      return res.status(HttpStatus.OK).json(roleParts);
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
