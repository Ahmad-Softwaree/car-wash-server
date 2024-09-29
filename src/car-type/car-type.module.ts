import { Module } from '@nestjs/common';
import { CarTypeService } from './car-type.service';
import { CarTypeController } from './car-type.controller';
import { PartGuard } from 'src/auth/part.guard';
import { Reflector } from '@nestjs/core';
import { KnexModule } from 'src/knex/knex.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [CarTypeController],
  providers: [CarTypeService, PartGuard, Reflector],
  imports: [KnexModule, UserModule],
})
export class CarTypeModule {}