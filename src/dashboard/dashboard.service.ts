import { Inject, Injectable } from '@nestjs/common';
import { Expense, User } from 'database/types';
import { Knex } from 'knex';

@Injectable()
export class DashboardService {
  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

  async get(): Promise<any> {
    try {
      // Count total and deleted expenses
      const expenseCounts: any = await this.knex<Expense>('expense')
        .select(
          this.knex.raw('SUM(price) as total'),
          this.knex.raw('COUNT(*) as total_count'),
          this.knex.raw('COUNT(CASE WHEN deleted THEN 1 END) as deleted_count'),
        )
        .first();

      // Count of users with deleted counts
      const all_users = await this.knex<User>('user')
        .count('id as count')
        .first()
        .then((res: any) => res.count);
      const deleted_users = await this.knex<User>('user')
        .count('id as count')
        .where('deleted', true)
        .first()
        .then((res: any) => res.count);

      // Count of roles with deleted counts
      const role_count = await this.knex('role')
        .count('id as count')
        .first()
        .then((res: any) => res.count);
      const deleted_role_count = await this.knex('role')
        .count('id as count')
        .where('deleted', true)
        .first()
        .then((res: any) => res.count);

      // Count of items with deleted counts
      const item_count = await this.knex('item')
        .count('id as count')
        .first()
        .then((res: any) => res.count);
      const deleted_item_count = await this.knex('item')
        .count('id as count')
        .where('deleted', true)
        .first()
        .then((res: any) => res.count);

      // Count of sell with deleted counts
      const sell_count = await this.knex('sell')
        .count('id as count')
        .first()
        .then((res: any) => res.count);
      const deleted_sell_count = await this.knex('sell')
        .count('id as count')
        .where('deleted', true)
        .first()
        .then((res: any) => res.count);

      // Count of item quantity history with deleted counts
      const item_quantity_history_count = await this.knex(
        'item_quantity_history',
      )
        .count('id as count')
        .first()
        .then((res: any) => res.count);
      const deleted_item_quantity_history_count = await this.knex(
        'item_quantity_history',
      )
        .count('id as count')
        .where('deleted', true)
        .first()
        .then((res: any) => res.count);

      // Count of sell items with deleted counts
      const sell_item_count = await this.knex('sell_item')
        .count('id as count')
        .first()
        .then((res: any) => res.count);
      const deleted_sell_item_count = await this.knex('sell_item')
        .count('id as count')
        .where('deleted', true)
        .first()
        .then((res: any) => res.count);

      // Count of backup with deleted counts
      const backup_count = await this.knex('backup')
        .count('id as count')
        .first()
        .then((res: any) => res.count);
      const deleted_backup_count = await this.knex('backup')
        .count('id as count')
        .where('deleted', true)
        .first()
        .then((res: any) => res.count);

      // Count of expense types with deleted counts
      const expense_type_count = await this.knex('expense_type')
        .count('id as count')
        .first()
        .then((res: any) => res.count);
      const deleted_expense_type_count = await this.knex('expense_type')
        .count('id as count')
        .where('deleted', true)
        .first()
        .then((res: any) => res.count);

      // Count of item types with deleted counts
      const item_type_count = await this.knex('item_type')
        .count('id as count')
        .first()
        .then((res: any) => res.count);
      const deleted_item_type_count = await this.knex('item_type')
        .count('id as count')
        .where('deleted', true)
        .first()
        .then((res: any) => res.count);

      // Count of service types with deleted counts
      const service_count = await this.knex('service')
        .count('id as count')
        .first()
        .then((res: any) => res.count);
      const deleted_service_count = await this.knex('service')
        .count('id as count')
        .where('deleted', true)
        .first()
        .then((res: any) => res.count);

      // Count of car models with deleted counts
      const car_model_count = await this.knex('car_model')
        .count('id as count')
        .first()
        .then((res: any) => res.count);
      const deleted_car_model_count = await this.knex('car_model')
        .count('id as count')
        .where('deleted', true)
        .first()
        .then((res: any) => res.count);

      // Count of car types with deleted counts
      const car_type_count = await this.knex('car_type')
        .count('id as count')
        .first()
        .then((res: any) => res.count);
      const deleted_car_type_count = await this.knex('car_type')
        .count('id as count')
        .where('deleted', true)
        .first()
        .then((res: any) => res.count);

      // Count of colors with deleted counts
      const color_count = await this.knex('color')
        .count('id as count')
        .first()
        .then((res: any) => res.count);
      const deleted_color_count = await this.knex('color')
        .count('id as count')
        .where('deleted', true)
        .first()
        .then((res: any) => res.count);

      // Count of reservations, completed and not completed
      const reservation_count = await this.knex('reservation')
        .count('id as count')
        .first()
        .then((res: any) => res.count);
      const completed_reservation_count = await this.knex('reservation')
        .count('id as count')
        .where('completed', true)
        .first()
        .then((res: any) => res.count);
      const not_completed_reservation_count = await this.knex('reservation')
        .count('id as count')
        .where('completed', false)
        .first()
        .then((res: any) => res.count);

      return {
        expense_total: expenseCounts.total,
        total_expenses: expenseCounts.total_count,
        deleted_expenses: expenseCounts.deleted_count,
        from_case_expenses: expenseCounts.from_case_count,
        not_from_case_expenses: expenseCounts.not_from_case_count,
        all_users,
        deleted_users,
        role_count,
        deleted_role_count,
        item_count,
        deleted_item_count,
        sell_count,
        deleted_sell_count,
        item_quantity_history_count,
        deleted_item_quantity_history_count,
        sell_item_count,
        deleted_sell_item_count,
        backup_count,
        deleted_backup_count,
        expense_type_count,
        deleted_expense_type_count,
        item_type_count,
        deleted_item_type_count,
        service_count,
        deleted_service_count,
        car_model_count,
        deleted_car_model_count,
        car_type_count,
        deleted_car_type_count,
        color_count,
        deleted_color_count,
        reservation_count,
        completed_reservation_count,
        not_completed_reservation_count,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
