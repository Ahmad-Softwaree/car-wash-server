import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { RoleModule } from './role/role.module';

import { JwtModule } from '@nestjs/jwt';
import { PartModule } from './part/part.module';

import { KnexModule } from './knex/knex.module';
import { UserPartModule } from './user-part/user-part.module';
import { RolePartModule } from './role-part/role-part.module';
import { CarModelModule } from './car-model/car-model.module';
import { CarTypeModule } from './car-type/car-type.module';
import { ColorModule } from './color/color.module';
import { ServiceModule } from './service/service.module';

import { ExpenseTypeModule } from './expense-type/expense-type.module';
import { ExpenseModule } from './expense/expense.module';
import { CustomerModule } from './customer/customer.module';
import { ItemModule } from './item/item.module';
import { ItemTypeModule } from './item-type/item-type.module';
import { SellModule } from './sell/sell.module';
import { ReservationModule } from './reservation/reservation.module';
import { BackupModule } from './backup/backup.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportModule } from './report/report.module';
import { ConfigModule as MyConfigModule } from './config/config.module';

@Module({
  imports: [
    KnexModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),

    AuthModule,
    UserModule,
    RoleModule,
    PartModule,
    UserPartModule,
    RolePartModule,
    ConfigModule,
    CarModelModule,
    CarTypeModule,
    ColorModule,
    ServiceModule,
    ExpenseModule,
    ExpenseTypeModule,
    CustomerModule,
    ItemModule,
    ItemTypeModule,
    SellModule,
    MyConfigModule,
    ReservationModule,
    BackupModule,
    DashboardModule,
    ReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
