import { Module } from '@nestjs/common';
import { CarModelService } from './car-model.service';
import { CarModelController } from './car-model.controller';
import { PartGuard } from 'src/auth/part.guard';
import { Reflector } from '@nestjs/core';
import { KnexModule } from 'src/knex/knex.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [CarModelController],
  providers: [CarModelService, PartGuard, Reflector],
  imports: [KnexModule, UserModule],
})
export class CarModelModule {}
