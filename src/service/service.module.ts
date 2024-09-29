import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { PartGuard } from 'src/auth/part.guard';
import { Reflector } from '@nestjs/core';
import { KnexModule } from 'src/knex/knex.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [ServiceController],
  providers: [ServiceService, PartGuard, Reflector],
  imports: [KnexModule, UserModule],
})
export class ServiceModule {}
