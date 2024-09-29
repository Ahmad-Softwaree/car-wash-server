import { Inject, Injectable, NotFoundException } from '@nestjs/common';

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
import { CreateItemDto } from './dto/create-item-dto';
import { UpdateItemDto } from './dto/update-item-dto';
import { ItemWithType } from 'src/types/item';
import { Item } from 'database/types';
import { ChangeItemQuantityDto } from './dto/change-item-quantity-dto';

@Injectable()
export class ItemService {
  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

  async getItemQuantity(
    item_id: Id,
  ): Promise<Pick<Item, 'id' | 'quantity'> & { actual_quantity: number }> {
    try {
      const quantity: Pick<Item, 'id' | 'quantity'> & {
        actual_quantity: number;
      } = await this.knex<Item>('item')
        .select(
          'item.id',
          'item.quantity',
          this.knex.raw(
            'CAST(COALESCE(item.quantity, 0) - COALESCE(SUM(sell_item.quantity), 0) AS INT) as actual_quantity', // Cast to INT
          ),
        )
        .leftJoin('sell_item', (join) => {
          join
            .on('item.id', 'sell_item.item_id')
            .andOn('sell_item.deleted', '=', this.knex.raw('false'));
        })
        .where('item.id', item_id)
        .andWhere('item.deleted', false)
        .groupBy('item.quantity', 'item.id')
        .first();

      return quantity;
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
  ): Promise<PaginationReturnType<ItemWithType[]>> {
    try {
      const items: ItemWithType[] = await this.knex<Item>('item')
        .select(
          'item.*',
          'item_type.id as type_id',
          'item_type.name as type_name',
          'createdUser.username as created_by', // Alias for created_by user
          'updatedUser.username as updated_by', // Alias for updated_by user
          this.knex.raw(
            'CAST(COALESCE(item.quantity, 0) - COALESCE(SUM(sell_item.quantity), 0) AS INT) as actual_quantity', // Cast to INT
          ),
        )
        .leftJoin('user as createdUser', 'item.created_by', 'createdUser.id') // Join for created_by
        .leftJoin('user as updatedUser', 'item.updated_by', 'updatedUser.id') // Join for updated_by
        .leftJoin('item_type', 'item.type_id', 'item_type.id')
        .leftJoin('sell_item', (join) => {
          join
            .on('item.id', 'sell_item.item_id')
            .andOn('sell_item.deleted', '=', this.knex.raw('false'));
        })

        .where('item.deleted', false)
        .andWhere(function () {
          if (filter != '' && filter) {
            this.where('item_type.id', filter);
          }
          if (from != '' && from && to != '' && to) {
            const fromDate = timestampToDateString(Number(from));
            const toDate = timestampToDateString(Number(to));
            this.whereBetween('item.created_at', [fromDate, toDate]);
          }
        })
        .groupBy(
          'item.id', // Include primary key
          'item.name', // Select specific columns from item
          'item.type_id',
          'item.created_at',
          'item.deleted',
          'item.quantity',
          'item_type.id',
          'item_type.name', // Group by all selected non-aggregated columns
          'createdUser.username',
          'updatedUser.username',
        )
        .offset((page - 1) * limit)
        .limit(limit)
        .orderBy('item.id', 'desc');

      const { hasNextPage } = await generatePaginationInfo(
        this.knex<Item>('item'),
        page,
        limit,
        false,
        false,
      );

      return {
        paginatedData: items,
        meta: {
          nextPageUrl: hasNextPage
            ? `/localhost:3001?page=${Number(page) + 1}&limit=${limit}`
            : null,
          total: items.length,
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
  ): Promise<PaginationReturnType<ItemWithType[]>> {
    try {
      const items: ItemWithType[] = await this.knex<Item>('item')
        .select(
          'item.*',
          'item_type.id as type_id',
          'item_type.name as type_name',
          'createdUser.username as created_by', // Alias for created_by user
          'updatedUser.username as updated_by', // Alias for updated_by user
          this.knex.raw(
            'CAST(COALESCE(item.quantity, 0) - COALESCE(SUM(sell_item.quantity), 0) AS INT) as actual_quantity', // Cast to INT
          ),
        )
        .leftJoin('item_type', 'item.type_id', 'item_type.id')
        .leftJoin('user as createdUser', 'item.created_by', 'createdUser.id') // Join for created_by
        .leftJoin('user as updatedUser', 'item.updated_by', 'updatedUser.id') // Join for updated_by
        .leftJoin('sell_item', (join) => {
          join
            .on('item.id', 'sell_item.item_id')
            .andOn('sell_item.deleted', '=', this.knex.raw('false'));
        })
        .where('item.deleted', true)
        .andWhere(function () {
          if (filter != '' && filter) {
            this.where('item_type.id', filter);
          }
          if (from != '' && from && to != '' && to) {
            const fromDate = timestampToDateString(Number(from));
            const toDate = timestampToDateString(Number(to));
            this.whereBetween('item.created_at', [fromDate, toDate]);
          }
        })
        .groupBy(
          'item.id', // Include primary key
          'item.name', // Select specific columns from item
          'item.type_id',
          'item.created_at',
          'item.deleted',
          'item.quantity',
          'item_type.id',
          'item_type.name', // Group by all selected non-aggregated columns
          'createdUser.username',
          'updatedUser.username',
        )
        .offset((page - 1) * limit)
        .limit(limit)
        .orderBy('item.id', 'desc');

      const { hasNextPage } = await generatePaginationInfo(
        this.knex<Item>('item'),
        page,
        limit,
        true,
      );

      return {
        paginatedData: items,
        meta: {
          nextPageUrl: hasNextPage
            ? `/localhost:3001?page=${Number(page) + 1}&limit=${limit}`
            : null,
          total: items.length,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async search(search: Search): Promise<ItemWithType[]> {
    try {
      const items: ItemWithType[] = await this.knex<Item>('item')
        .select(
          'item.*',
          'item_type.id as type_id',
          'item_type.name as type_name',
          'createdUser.username as created_by', // Alias for created_by user
          'updatedUser.username as updated_by', // Alias for updated_by user
          this.knex.raw(
            'CAST(COALESCE(item.quantity, 0) - COALESCE(SUM(sell_item.quantity), 0) AS INT) as actual_quantity', // Cast to INT
          ),
        )
        .leftJoin('user as createdUser', 'item.created_by', 'createdUser.id') // Join for created_by
        .leftJoin('user as updatedUser', 'item.updated_by', 'updatedUser.id') // Join for updated_by
        .leftJoin('item_type', 'item.type_id', 'item_type.id')
        .leftJoin('sell_item', (join) => {
          join
            .on('item.id', 'sell_item.item_id')
            .andOn('sell_item.deleted', '=', this.knex.raw('false'));
        })
        .where('item.deleted', false)
        .andWhere(function () {
          this.where('item.name', 'ilike', `%${search}%`).orWhere(
            'item.barcode',
            'ilike',
            `%${search}%`,
          );
        })
        .groupBy(
          'item.id', // Include primary key
          'item.name', // Select specific columns from item
          'item.type_id',
          'item.created_at',
          'item.deleted',
          'item.quantity',
          'item_type.id',
          'item_type.name', // Group by all selected non-aggregated columns
          'createdUser.username',
          'updatedUser.username',
        )
        .limit(30);

      return items;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async deletedSearch(search: Search): Promise<ItemWithType[]> {
    try {
      const items: ItemWithType[] = await this.knex<Item>('item')
        .select(
          'item.*',
          'item_type.id as type_id',
          'item_type.name as type_name',
          'createdUser.username as created_by', // Alias for created_by user
          'updatedUser.username as updated_by', // Alias for updated_by user
          this.knex.raw(
            'CAST(COALESCE(item.quantity, 0) - COALESCE(SUM(sell_item.quantity), 0) AS INT) as actual_quantity', // Cast to INT
          ),
        )
        .leftJoin('user as createdUser', 'item.created_by', 'createdUser.id') // Join for created_by
        .leftJoin('user as updatedUser', 'item.updated_by', 'updatedUser.id') // Join for updated_by
        .leftJoin('item_type', 'item.type_id', 'item_type.id')
        .leftJoin('sell_item', (join) => {
          join
            .on('item.id', 'sell_item.item_id')
            .andOn('sell_item.deleted', '=', this.knex.raw('false'));
        })
        .where('item.deleted', true)
        .andWhere(function () {
          this.where('item.name', 'ilike', `%${search}%`).orWhere(
            'item.barcode',
            'ilike',
            `%${search}%`,
          );
        })
        .groupBy(
          'item.id', // Include primary key
          'item.name', // Select specific columns from item
          'item.type_id',
          'item.created_at',
          'item.deleted',
          'item.quantity',
          'item_type.id',
          'item_type.name', // Group by all selected non-aggregated columns
          'createdUser.username',
          'updatedUser.username',
        )
        .limit(30);
      return items;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async findOne(id: Id): Promise<ItemWithType> {
    try {
      const item: ItemWithType = await this.knex<Item>('item')
        .select(
          'item.*',
          'item_type.id as type_id',
          'item_type.name as type_name',
          'createdUser.username as created_by', // Alias for created_by user
          'updatedUser.username as updated_by', // Alias for updated_by user
          this.knex.raw(
            'CAST(COALESCE(item.quantity, 0) - COALESCE(SUM(sell_item.quantity), 0) AS INT) as actual_quantity', // Cast to INT
          ),
        )
        .leftJoin('user as createdUser', 'item.created_by', 'createdUser.id') // Join for created_by
        .leftJoin('user as updatedUser', 'item.updated_by', 'updatedUser.id') // Join for updated_by
        .leftJoin('item_type', 'item.type_id', 'item_type.id')
        .leftJoin('sell_item', (join) => {
          join
            .on('item.id', 'sell_item.item_id')
            .andOn('sell_item.deleted', '=', this.knex.raw('false'));
        })
        .where('item.id', id)
        .andWhere('item.deleted', false)
        .groupBy(
          'item.id', // Include primary key
          'item.name', // Select specific columns from item
          'item.type_id',
          'item.created_at',
          'item.deleted',
          'item.quantity',
          'item_type.id',
          'item_type.name', // Group by all selected non-aggregated columns
          'createdUser.username',
          'updatedUser.username',
        )
        .first();

      if (!item) {
        throw new NotFoundException(`ItemWithType with ID ${id} not found`);
      }
      return item;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async create(data: CreateItemDto, user_id: number): Promise<Item> {
    try {
      const item: Item[] = await this.knex<Item>('item')

        .where('item.deleted', false)

        .insert({ created_by: user_id, ...data })
        .returning('*');
      return item[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(id: Id, data: UpdateItemDto, user_id: number): Promise<Item> {
    try {
      let { quantity, ...others } = data;
      const result: Item[] = await this.knex<Item>('item')
        .where('item.id', id)
        .andWhere('item.deleted', false)
        .update({ updated_by: user_id, ...others })
        .returning('*');

      if (result.length === 0) {
        throw new NotFoundException(`ItemWithType with ID ${id} not found`);
      }
      return result[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async changeQuantity(
    id: Id,
    type: 'increase' | 'decrease',
    data: ChangeItemQuantityDto,
  ): Promise<ItemWithType> {
    try {
      let item: Pick<Item, 'quantity' | 'id'> = await this.knex<Item>('item')
        .select('quantity', 'id')
        .where('id', id)
        .first();
      const result: Item[] = await this.knex<Item>('item')

        .where('item.id', id)
        .andWhere('item.deleted', false)

        .update({
          quantity:
            type == 'increase'
              ? Number(item.quantity) + Number(data.quantity)
              : Number(item.quantity) - Number(data.quantity),
        })
        .returning('*');

      if (result.length === 0) {
        throw new NotFoundException(`Item with ID ${id} not found`);
      }
      let last = await this.findOne(id);

      return last;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async delete(id: Id): Promise<Id> {
    try {
      await this.knex<Item>('item').where('id', id).update({ deleted: true });
      return id;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async restore(id: Id): Promise<Id> {
    try {
      await this.knex<Item>('item').where('id', id).update({ deleted: false });
      return id;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
