import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import CreateColorDto from './dto/create-color.dto';
import UpdateColorDto from './dto/update-color.dto';
import { Knex } from 'knex';
import { Color, Reservation, User } from 'database/types';
import {
  From,
  Id,
  Limit,
  Page,
  PaginationReturnType,
  Search,
  To,
} from 'src/types/global';

import { generatePaginationInfo, timestampToDateString } from 'lib/functions';
import { ENUMs } from 'lib/enum';

@Injectable()
export class ColorService {
  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

  async checkColorExistById(id: Id): Promise<boolean> {
    try {
      let color = await this.knex<Color>('color')
        .select('id')
        .where('id', id)
        .andWhere('deleted', false);
      return Boolean(color);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAll(
    page: Page,
    limit: Limit,
    from: From,
    to: To,
  ): Promise<PaginationReturnType<Color[]>> {
    try {
      const colors: Color[] = await this.knex
        .table<Color>('color')
        .offset((page - 1) * limit)
        .where('deleted', false)
        .andWhere(function () {
          if (from != '' && from && to != '' && to) {
            const fromDate = timestampToDateString(Number(from));
            const toDate = timestampToDateString(Number(to));
            this.whereBetween('created_at', [fromDate, toDate]);
          }
        })
        .limit(limit)
        .select('*')
        .orderBy('id', 'desc');

      const { hasNextPage } = await generatePaginationInfo<Color>(
        this.knex<Color>('color'),
        page,
        limit,
        false,
      );
      return {
        paginatedData: colors,
        meta: {
          nextPageUrl: hasNextPage
            ? `/localhost:3001?page=${Number(page) + 1}&limit=${limit}`
            : null,
          total: colors.length,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getSelect(): Promise<Color[]> {
    try {
      const colors: Color[] = await this.knex
        .table<Color>('color')
        .where('deleted', false)
        .select('*');

      return colors;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getAllDeleted(
    page: Page,
    limit: Limit,
    from: From,
    to: To,
  ): Promise<PaginationReturnType<Color[]>> {
    try {
      const colors: Color[] = await this.knex
        .table<Color>('color')
        .offset((page - 1) * limit)
        .where('deleted', true)
        .andWhere(function () {
          if (from != '' && from && to != '' && to) {
            const fromDate = timestampToDateString(Number(from));
            const toDate = timestampToDateString(Number(to));
            this.whereBetween('created_at', [fromDate, toDate]);
          }
        })
        .limit(limit)
        .select('*')
        .orderBy('id', 'desc');

      const { hasNextPage } = await generatePaginationInfo<Color>(
        this.knex<Color>('color'),
        page,
        limit,
        true,
      );
      return {
        paginatedData: colors,
        meta: {
          nextPageUrl: hasNextPage
            ? `/localhost:3001?page=${Number(page) + 1}&limit=${limit}`
            : null,
          total: colors.length,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async search(search: Search): Promise<Color[]> {
    try {
      const colors: Color[] = await this.knex
        .table<Color>('color')
        .where(function () {
          this.where('name', 'ilike', `%${search}%`);
        })
        .andWhere('deleted', false)
        .limit(ENUMs.SEARCH_LIMIT as number)
        .select('*');

      return colors;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async deletedSearch(search: Search): Promise<Color[]> {
    try {
      const colors: Color[] = await this.knex
        .table<Color>('color')
        .where(function () {
          this.where('name', 'ilike', `%${search}%`);
        })
        .andWhere('deleted', true)
        .limit(ENUMs.SEARCH_LIMIT as number)
        .select('*');

      return colors;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async create(data: CreateColorDto): Promise<Color> {
    try {
      const color: Color[] = await this.knex<Color>('color')
        .insert({
          name: data.name,
        })
        .returning('*');

      return color[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(id: Id, data: UpdateColorDto): Promise<Color> {
    try {
      const color: Color[] = await this.knex
        .table<Color>('color')
        .where({ id })
        .update({
          name: data.name,
        })
        .returning('*');

      if (color.length === 0) {
        throw new NotFoundException(`Color with ID ${id} not found`);
      }

      return color[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async delete(id: Id): Promise<Id> {
    try {
      let check = await this.knex
        .table<Reservation>('reservation')
        .where('color_id', id)
        .count('id as count')
        .first();
      if (check.count != 0) {
        throw new BadRequestException('ناتوانی بیسڕیتەوە، چونکە بەکارهاتوە');
      }
      await this.knex
        .table<Color>('color')
        .where('id', id)
        .update({ deleted: true });

      return id;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async restore(id: Id): Promise<Id> {
    try {
      await this.knex
        .table<Color>('color')
        .where('id', id)
        .update({ deleted: false });

      return id;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
