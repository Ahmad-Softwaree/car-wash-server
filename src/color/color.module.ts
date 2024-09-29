import { Module } from '@nestjs/common';
import { ColorService } from './color.service';
import { ColorController } from './color.controller';
import { PartGuard } from 'src/auth/part.guard';
import { Reflector } from '@nestjs/core';
import { KnexModule } from 'src/knex/knex.module';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [ColorController],
  providers: [ColorService, PartGuard, Reflector],
  imports: [KnexModule, UserModule],
})
export class ColorModule {}
