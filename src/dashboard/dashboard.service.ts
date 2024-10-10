import { Inject, Injectable } from '@nestjs/common';
import {
  Backup,
  Expense,
  Item,
  ItemQuantityHistory,
  Reservation,
  Sell,
  SellItem,
  User,
} from 'database/types';
import { Knex } from 'knex';
import { Dashboard, ExpenseCounts } from 'src/types/dashboard';

@Injectable()
export class DashboardService {
  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

  async get(): Promise<Dashboard> {
    try {
      // Count total and deleted expenses
      const expenseCounts: ExpenseCounts = await this.knex<Expense>('expense')
        .select(
          this.knex.raw<ExpenseCounts>('SUM(price) as total_expense'),
          this.knex.raw<ExpenseCounts>('COUNT(*) as count_expense'),
        )
        .first<ExpenseCounts>();

      // Count of users with deleted counts
      const users: string = await this.knex<User>('user')
        .count('id as count')
        .first();

      // Count of items with deleted counts
      const item: string = await this.knex<Item>('item')
        .count('id as count')
        .first()
        .then((res: any) => res.count);

      // Count of sell with deleted counts
      const sell: string = await this.knex<Sell>('sell')
        .count('id as count')
        .first()
        .then((res: any) => res.count);

      // Count of item quantity history with deleted counts
      const item_quantity_history: string =
        await this.knex<ItemQuantityHistory>('item_quantity_history')
          .count('id as count')
          .first()
          .then((res: any) => res.count);

      // Count of backup with deleted counts
      const backup: string = await this.knex<Backup>('backup')
        .count('id as count')
        .first()
        .then((res: any) => res.count);

      const reservations: Reservation[] = await this.knex<Reservation>(
        'reservation',
      )
        .select(
          'reservation.price',
          'reservation.id',
          'reservation.customer_id',
          'reservation.date_time',
          'reservation.completed',
          'customer.first_name as customer_first_name',
          'customer.last_name as customer_last_name',
        )
        .leftJoin('customer', 'reservation.customer_id', 'customer.id')
        .limit(50)
        .orderBy('id', 'asc');

      let total_reservation_price: { total_reservation_price: number } =
        await this.knex<Reservation>('reservation')
          .select(
            this.knex.raw(
              'COALESCE(SUM(reservation.price), 0) as total_reservation_price',
            ),
          )
          .first<{ total_reservation_price: number }>();

      return {
        count_expense: expenseCounts.count_expense,
        total_expense: expenseCounts.total_expense,
        users,
        item,
        sell,
        item_quantity_history,
        backup,
        reservations,
        total_reservation_price:
          total_reservation_price.total_reservation_price,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
