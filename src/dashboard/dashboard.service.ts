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
        .where('deleted', false)
        .count('id as count')
        .first()
        .then((res: any) => res.count);

      // Count of items with deleted counts
      const item: string = await this.knex<Item>('item')
        .where('deleted', false)
        .count('id as count')
        .first()
        .then((res: any) => res.count);

      // Count of sell with deleted counts
      const sell: string = await this.knex<Sell>('sell')
        .where('deleted', false)
        .count('id as count')
        .first()
        .then((res: any) => res.count);

      // Count of item quantity history with deleted counts
      const item_quantity_history: string =
        await this.knex<ItemQuantityHistory>('item_quantity_history')
          .where('deleted', false)
          .count('id as count')
          .first()
          .then((res: any) => res.count);

      // Count of backup with deleted counts
      const backup: string = await this.knex<Backup>('backup')
        .where('deleted', false)
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
          'customer.name as customer_name',
        )
        .where('reservation.deleted', false)
        .leftJoin('customer', 'reservation.customer_id', 'customer.id')
        .limit(50)
        .orderBy('id', 'desc');

      let total_reservation_price: { total_reservation_price: number } =
        await this.knex<Reservation>('reservation')
          .select(
            this.knex.raw(
              'COALESCE(SUM(reservation.price), 0) as total_reservation_price',
            ),
          )
          .where('deleted', false)
          .first<{ total_reservation_price: number }>();

      const sells: Sell[] = await this.knex<Sell>('sell')
        .select(
          'sell.id',
          'sell.created_at',
          this.knex.raw(
            'COALESCE(SUM((sell_item.item_sell_price - sell_item.item_purchase_price) * sell_item.quantity), 0) as total_sell_price',
          ),
        )
        .leftJoin('sell_item', 'sell.id', 'sell_item.sell_id')
        .where('sell.deleted', false)
        .andWhere('sell_item.deleted', false)
        .andWhere('sell_item.self_deleted', false)
        .limit(50)
        .groupBy('sell.id')
        .orderBy('sell.id', 'desc');

      let total_sell_price: { total_sell_price: number } =
        await this.knex<SellItem>('sell_item')
          .where('deleted', false)
          .andWhere('self_deleted', false)
          .select(
            this.knex.raw(
              'COALESCE(SUM((sell_item.item_sell_price - sell_item.item_purchase_price) * sell_item.quantity), 0) as total_sell_price',
            ),
          )
          .first<{ total_sell_price: number }>();

      const item_history: ItemQuantityHistory[] =
        await this.knex<ItemQuantityHistory>('item_quantity_history')
          .select(
            'item_quantity_history.id',
            'item_quantity_history.created_at',
            'item_quantity_history.quantity',
            'item.name as item_name',
          )
          .leftJoin('item', 'item_quantity_history.item_id', 'item.id')
          .where('item_quantity_history.deleted', false)
          .limit(50)
          .groupBy('item_quantity_history.id', 'item.id')
          .orderBy('item_quantity_history.id', 'desc');

      let total_history: {
        increase_history: number;
        decrease_history: number;
      } = await this.knex<ItemQuantityHistory>('item_quantity_history')
        .where('deleted', false)
        .select(
          this.knex.raw(
            'COALESCE(SUM(CASE WHEN item_quantity_history.quantity > 0 THEN item_quantity_history.quantity ELSE 0 END), 0) as increase_history',
          ),
          this.knex.raw(
            'COALESCE(SUM(CASE WHEN item_quantity_history.quantity < 0 THEN ABS(item_quantity_history.quantity) ELSE 0 END), 0) as decrease_history',
          ),
        )
        .where('deleted', false)

        .first<{ increase_history: number; decrease_history: number }>();

      return {
        total_increase_history: total_history.increase_history,
        total_decrease_history: total_history.decrease_history,

        item_history,
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
        sells,
        total_sell_price: total_sell_price.total_sell_price,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
