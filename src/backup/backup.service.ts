import { Inject, Injectable } from '@nestjs/common';
import {
  Backup,
  BackupWithUser,
  CarModel,
  CarType,
  Color,
  Config,
  Customer,
  Expense,
  ExpenseType,
  Item,
  ItemQuantityHistory,
  ItemType,
  Reservation,
  Role,
  Sell,
  SellItem,
  Service,
  User,
} from 'database/types';
import { Knex } from 'knex';
import { generatePaginationInfo, timestampToDateString } from 'lib/functions';
import { Printer } from 'pdf-to-printer';
import {
  Filter,
  From,
  Id,
  Limit,
  Page,
  PaginationReturnType,
  To,
} from 'src/types/global';

@Injectable()
export class BackupService {
  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

  async getTableNames(): Promise<string[]> {
    try {
      const tableNames = await this.knex
        .select('table_name')
        .from('information_schema.tables')
        .where('table_schema', 'public');

      return tableNames.map((row) => row.table_name);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAll(
    page: Page,
    limit: Limit,
    filter: Filter,
    from: From,
    to: To,
  ): Promise<PaginationReturnType<BackupWithUser[]>> {
    try {
      const data: BackupWithUser[] = await this.knex('backup')
        .select(
          'backup.*', // Select all fields from the backup table
          'user.id as user_id', // Get the user ID
          'user.name as user_name', // Get the user name
          'role.name as user_role', // Get the role name from the role table
        )
        .join('user', 'backup.user_id', 'user.id') // Join with the user table on user_id
        .join('role', 'user.role_id', 'role.id') // Join the user table with the role table on role_id
        .offset((page - 1) * limit)
        .limit(limit)
        .where(function () {
          if (filter != '' && filter) {
            this.where('backup.table', filter);
          }
        })
        .andWhere(function () {
          if (from != '' && from && to != '' && to) {
            const fromDate = timestampToDateString(Number(from));
            const toDate = timestampToDateString(Number(to));
            this.whereBetween('backup.created_at', [fromDate, toDate]);
          }
        })
        .orderBy('id', 'desc');

      const { hasNextPage } = await generatePaginationInfo<Backup>(
        this.knex<Backup>('backup'),
        page,
        limit,
        false,
      );
      return {
        paginatedData: data,
        meta: {
          nextPageUrl: hasNextPage
            ? `/localhost:3001?page=${Number(page) + 1}&limit=${limit}`
            : null,
          total: data.length,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async backupUsers(user_id: Id): Promise<User[]> {
    try {
      const data: User[] = await this.knex<User>('user').select('*');
      await this.knex<Backup>('backup').insert({
        table: 'user',
        user_id,
      });
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async backupCustomers(user_id: Id): Promise<Customer[]> {
    try {
      const data: Customer[] =
        await this.knex<Customer>('customer').select('*');
      await this.knex<Backup>('backup').insert({
        table: 'customer',
        user_id,
      });
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async backupReservations(user_id: Id): Promise<Reservation[]> {
    try {
      const data: Reservation[] =
        await this.knex<Reservation>('reservation').select('*');
      await this.knex<Backup>('backup').insert({
        table: 'reservation',
        user_id,
      });
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async backupItems(user_id: Id): Promise<Item[]> {
    try {
      const data: Item[] = await this.knex<Item>('item').select('*');
      await this.knex<Backup>('backup').insert({
        table: 'item',
        user_id,
      });
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async backupSells(user_id: Id): Promise<Sell[]> {
    try {
      const data: Sell[] = await this.knex<Sell>('sell').select('*');
      await this.knex<Backup>('backup').insert({
        table: 'sell',
        user_id,
      });
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async backupSellItems(user_id: Id): Promise<SellItem[]> {
    try {
      const data: SellItem[] =
        await this.knex<SellItem>('sell_item').select('*');
      await this.knex<Backup>('backup').insert({
        table: 'sell_item',
        user_id,
      });
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async backupExpenses(user_id: Id): Promise<Expense[]> {
    try {
      const data: Expense[] = await this.knex<Expense>('expense').select('*');
      await this.knex<Backup>('backup').insert({
        table: 'expense',
        user_id,
      });
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async backupRoles(user_id: Id): Promise<Role[]> {
    try {
      const data: Role[] = await this.knex<Role>('role').select('*');
      await this.knex<Backup>('backup').insert({
        table: 'role',
        user_id,
      });
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async backupColors(user_id: Id): Promise<Color[]> {
    try {
      const data: Color[] = await this.knex<Color>('color').select('*');
      await this.knex<Backup>('backup').insert({
        table: 'color',
        user_id,
      });
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async backupCarTypes(user_id: Id): Promise<CarType[]> {
    try {
      const data: CarType[] = await this.knex<CarType>('car_type').select('*');
      await this.knex<Backup>('backup').insert({
        table: 'car_type',
        user_id,
      });
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async backupCarModels(user_id: Id): Promise<CarModel[]> {
    try {
      const data: CarModel[] =
        await this.knex<CarModel>('car_model').select('*');
      await this.knex<Backup>('backup').insert({
        table: 'car_model',
        user_id,
      });
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async backupExpenseTypes(user_id: Id): Promise<ExpenseType[]> {
    try {
      const data: ExpenseType[] =
        await this.knex<ExpenseType>('expense_type').select('*');
      await this.knex<Backup>('backup').insert({
        table: 'expense_type',
        user_id,
      });
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async backupItemTypes(user_id: Id): Promise<ItemType[]> {
    try {
      const data: ItemType[] =
        await this.knex<ItemType>('item_type').select('*');
      await this.knex<Backup>('backup').insert({
        table: 'item_type',
        user_id,
      });
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async backupServices(user_id: Id): Promise<Service[]> {
    try {
      const data: Service[] = await this.knex<Service>('service').select('*');
      await this.knex<Backup>('backup').insert({
        table: 'service',
        user_id,
      });
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async backupPrinters(user_id: Id): Promise<Printer[]> {
    try {
      const data: Printer[] = await this.knex<Printer>('printer').select('*');
      await this.knex<Backup>('backup').insert({
        table: 'printer',
        user_id,
      });
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async backupItemQuantityHistories(
    user_id: Id,
  ): Promise<ItemQuantityHistory[]> {
    try {
      const data: ItemQuantityHistory[] = await this.knex<ItemQuantityHistory>(
        'item_quantity_history',
      ).select('*');
      await this.knex<Backup>('backup').insert({
        table: 'item_quantity_history',
        user_id,
      });
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async backupConfigs(user_id: Id): Promise<Config[]> {
    try {
      const data: Config[] = await this.knex<Config>('config').select('*');
      await this.knex<Backup>('backup').insert({
        table: 'config',
        user_id,
      });
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
