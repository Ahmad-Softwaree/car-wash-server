import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import CreateCarTypeDto from './dto/create-car-type.dto';
import UpdateCarTypeDto from './dto/update-car-type.dto';
import { Knex } from 'knex';
import { CarType, Reservation, User } from 'database/types';
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
export class CarTypeService {
  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

  async checkCarTypeExistById(id: Id): Promise<boolean> {
    try {
      let carType = await this.knex<CarType>('car_type')
        .select('id')
        .where('id', id)
        .andWhere('deleted', false);
      return Boolean(carType);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAll(
    page: Page,
    limit: Limit,
    from: From,
    to: To,
  ): Promise<PaginationReturnType<CarType[]>> {
    try {
      const carTypes: CarType[] = await this.knex
        .table<CarType>('car_type')
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

      const { hasNextPage } = await generatePaginationInfo<CarType>(
        this.knex<CarType>('car_type'),
        page,
        limit,
        false,
      );
      return {
        paginatedData: carTypes,
        meta: {
          nextPageUrl: hasNextPage
            ? `/localhost:3001?page=${Number(page) + 1}&limit=${limit}`
            : null,
          total: carTypes.length,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getSelect(): Promise<CarType[]> {
    try {
      const carTypes: CarType[] = await this.knex
        .table<CarType>('car_type')
        .where('deleted', false)
        .select('*');

      return carTypes;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getAllDeleted(
    page: Page,
    limit: Limit,
    from: From,
    to: To,
  ): Promise<PaginationReturnType<CarType[]>> {
    try {
      const carTypes: CarType[] = await this.knex
        .table<CarType>('car_type')
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

      const { hasNextPage } = await generatePaginationInfo<CarType>(
        this.knex<CarType>('car_type'),
        page,
        limit,
        true,
      );
      return {
        paginatedData: carTypes,
        meta: {
          nextPageUrl: hasNextPage
            ? `/localhost:3001?page=${Number(page) + 1}&limit=${limit}`
            : null,
          total: carTypes.length,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async search(search: Search): Promise<CarType[]> {
    try {
      const carTypes: CarType[] = await this.knex
        .table<CarType>('car_type')
        .where(function () {
          this.where('name', 'ilike', `%${search}%`);
        })
        .andWhere('deleted', false)
        .limit(ENUMs.SEARCH_LIMIT as number)
        .select('*');

      return carTypes;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async deletedSearch(search: Search): Promise<CarType[]> {
    try {
      const carTypes: CarType[] = await this.knex
        .table<CarType>('car_type')
        .where(function () {
          this.where('name', 'ilike', `%${search}%`);
        })
        .andWhere('deleted', true)
        .limit(ENUMs.SEARCH_LIMIT as number)
        .select('*');

      return carTypes;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async create(data: CreateCarTypeDto): Promise<CarType> {
    try {
      const carType: CarType[] = await this.knex<CarType>('car_type')
        .insert({
          name: data.name,
        })
        .returning('*');

      return carType[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(id: Id, data: UpdateCarTypeDto): Promise<CarType> {
    try {
      const carType: CarType[] = await this.knex
        .table<CarType>('car_type')
        .where({ id })
        .update({
          name: data.name,
        })
        .returning('*');

      if (carType.length === 0) {
        throw new NotFoundException(`ئەم داتایە بوونی نیە`);
      }

      return carType[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async delete(id: Id): Promise<Id> {
    try {
      let check = await this.knex
        .table<Reservation>('reservation')
        .where('car_type_id', id)
        .count('id as count')
        .first();
      if (check.count != 0) {
        throw new BadRequestException('ناتوانی بیسڕیتەوە، چونکە بەکارهاتوە');
      }
      await this.knex
        .table<CarType>('car_type')
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
        .table<CarType>('car_type')
        .where('id', id)
        .update({ deleted: false });

      return id;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
