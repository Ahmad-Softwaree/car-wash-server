import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { PartModule } from 'src/part/part.module';
import { Reflector } from '@nestjs/core';
import { KnexModule } from 'src/knex/knex.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [ReservationController],
  providers: [ReservationService, PartModule, Reflector],
  imports: [KnexModule, UserModule],
})
export class ReservationModule {}
