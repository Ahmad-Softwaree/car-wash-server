import { Inject, Injectable } from '@nestjs/common';
import { Expense } from 'database/types';
import { Knex } from 'knex';

@Injectable()
export class DashboardService {
  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

  async get(): Promise<any> {
    try {
      let expense_total: { total: number } = await this.knex('expense')
        .sum('price as total')
        .first();

      return {
        expense_total: expense_total.total,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
