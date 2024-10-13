import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import * as bcrypt from 'bcryptjs';
import { Knex } from 'knex';

import {
  Filter,
  From,
  Id,
  Limit,
  Page,
  PaginationReturnType,
  Search,
  To,
} from 'src/types/global';
import { generatePaginationInfo, timestampToDateString } from 'lib/functions';
import { CreateExpenseDto } from './dto/create-expense-dto';
import { UpdateExpenseDto } from './dto/update-expense-dto';
import { ExpenseWithType } from 'src/types/expense';
import { Expense } from 'database/types';

@Injectable()
export class ExpenseService {
  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}
  async getAll(
    page: Page,
    limit: Limit,
    filter: Filter,
    from: From,
    to: To,
  ): Promise<PaginationReturnType<ExpenseWithType[]>> {
    try {
      const expenses: ExpenseWithType[] = await this.knex<Expense>('expense')
        .select(
          'expense.*',
          'expense_type.id as type_id',
          'expense_type.name as type_name',
          'createdUser.username as created_by', // Alias for created_by user
          'updatedUser.username as updated_by', // Alias for updated_by user
        )
        .leftJoin('expense_type', 'expense.type_id', 'expense_type.id')
        .leftJoin('user as createdUser', 'expense.created_by', 'createdUser.id') // Join for created_by
        .leftJoin('user as updatedUser', 'expense.updated_by', 'updatedUser.id') // Join for updated_by
        .offset((page - 1) * limit)
        .where('expense.deleted', false)
        .andWhere(function () {
          if (filter !== '' && filter) {
            this.where('expense.type_id', filter);
          }

          if (from !== '' && from && to !== '' && to) {
            const fromDate = timestampToDateString(Number(from));
            const toDate = timestampToDateString(Number(to));
            this.whereBetween('expense.date', [fromDate, toDate]);
          }
        })
        .limit(limit)
        .orderBy('expense.id', 'desc');

      const { hasNextPage } = await generatePaginationInfo<Expense>(
        this.knex<Expense>('expense'),
        page,
        limit,
        false,
      );
      return {
        paginatedData: expenses,
        meta: {
          nextPageUrl: hasNextPage
            ? `/localhost:3001?page=${Number(page) + 1}&limit=${limit}`
            : null,
          total: expenses.length,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getAllDeleted(
    page: Page,
    limit: Limit,
    filter: Filter,
    from: From,
    to: To,
  ): Promise<PaginationReturnType<ExpenseWithType[]>> {
    try {
      const expenses: ExpenseWithType[] = await this.knex<Expense>('expense')
        .select(
          'expense.*',
          'expense_type.id as type_id',
          'expense_type.name as type_name',
          'createdUser.username as created_by', // Alias for created_by user
          'updatedUser.username as updated_by', // Alias for updated_by user
        )
        .leftJoin('expense_type', 'expense.type_id', 'expense_type.id')
        .leftJoin('user as createdUser', 'expense.created_by', 'createdUser.id') // Join for created_by
        .leftJoin('user as updatedUser', 'expense.updated_by', 'updatedUser.id') // Join for updated_by
        .offset((page - 1) * limit)
        .where('expense.deleted', true)
        .andWhere(function () {
          if (filter !== '' && filter) {
            this.where('expense.type_id', filter);
          }

          if (from !== '' && from && to !== '' && to) {
            const fromDate = timestampToDateString(Number(from));
            const toDate = timestampToDateString(Number(to));
            this.whereBetween('expense.date', [fromDate, toDate]);
          }
        })
        .limit(limit)
        .orderBy('expense.id', 'desc');

      const { hasNextPage } = await generatePaginationInfo<Expense>(
        this.knex<Expense>('expense'),
        page,
        limit,
        true,
      );
      return {
        paginatedData: expenses,
        meta: {
          nextPageUrl: hasNextPage
            ? `/localhost:3001?page=${Number(page) + 1}&limit=${limit}`
            : null,
          total: expenses.length,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async search(search: Search): Promise<ExpenseWithType[]> {
    try {
      const expenses: ExpenseWithType[] = await this.knex<Expense>('expense')
        .select(
          'expense.*',
          'expense_type.id as type_id',
          'expense_type.name as type_name',
          'createdUser.username as created_by',
          'updatedUser.username as updated_by',
        )
        .leftJoin('expense_type', 'expense.type_id', 'expense_type.id')
        .leftJoin('user as createdUser', 'expense.created_by', 'createdUser.id')
        .leftJoin('user as updatedUser', 'expense.updated_by', 'updatedUser.id')
        .where(function () {
          if (search && search !== '') {
            this.where('createdUser.username', 'ilike', `%${search}%`).orWhere(
              'updatedUser.username',
              'ilike',
              `%${search}%`,
            );
          }
        })
        .andWhere('expense.deleted', false)
        .limit(30);

      return expenses;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async deletedSearch(search: Search): Promise<ExpenseWithType[]> {
    try {
      const expenses: ExpenseWithType[] = await this.knex<Expense>('expense')
        .select(
          'expense.*',
          'expense_type.id as type_id',
          'expense_type.name as type_name',
          'createdUser.username as created_by',
          'updatedUser.username as updated_by',
        )
        .leftJoin('expense_type', 'expense.type_id', 'expense_type.id')
        .leftJoin('user as createdUser', 'expense.created_by', 'createdUser.id')
        .leftJoin('user as updatedUser', 'expense.updated_by', 'updatedUser.id')
        .where(function () {
          if (search && search !== '') {
            this.where('createdUser.username', 'ilike', `%${search}%`).orWhere(
              'updatedUser.username',
              'ilike',
              `%${search}%`,
            );
          }
        })
        .andWhere('expense.deleted', true)
        .limit(30);
      return expenses;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async findOne(id: Id): Promise<ExpenseWithType> {
    try {
      // Fetch expense and related type and parts
      const expense: ExpenseWithType = await this.knex<Expense>('expense')
        .select(
          'expense.*',
          'expense_type.id as type_id',
          'expense_type.name as type_name',
          'createdUser.username as created_by',
          'updatedUser.username as updated_by',
        )
        .leftJoin('expense_type', 'expense.type_id', 'expense_type.id')
        .leftJoin('user as createdUser', 'expense.created_by', 'createdUser.id')
        .leftJoin('user as updatedUser', 'expense.updated_by', 'updatedUser.id')
        .where('expense.deleted', false)
        .first();
      if (!expense) {
        throw new NotFoundException(`ئەم داتایە بوونی نیە`);
      }

      return expense;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async create(
    data: CreateExpenseDto,
    user_id: number,
  ): Promise<ExpenseWithType> {
    try {
      const expense: ExpenseWithType[] = await this.knex<Expense>('expense')
        .insert({ created_by: user_id, ...data })
        .leftJoin('expense_type', 'expense.type_id', 'expense_type.id')

        .returning('*');

      return expense[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(
    id: Id,
    data: UpdateExpenseDto,
    user_id: number,
  ): Promise<ExpenseWithType> {
    try {
      const result: ExpenseWithType[] = await this.knex<Expense>('expense')
        .where('expense.id', id)
        .update({ updated_by: user_id, ...data })
        .leftJoin('expense_type', 'expense.type_id', 'expense_type.id')
        .returning('*');

      if (result.length === 0) {
        throw new NotFoundException(`ئەم داتایە بوونی نیە`);
      }

      return result[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async delete(id: Id): Promise<Id> {
    try {
      await this.knex<Expense>('expense')
        .where('id', id)
        .update({ deleted: true });
      return id;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async restore(id: Id): Promise<Id> {
    try {
      await this.knex<Expense>('expense')
        .where('id', id)
        .update({ deleted: false });
      return id;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
