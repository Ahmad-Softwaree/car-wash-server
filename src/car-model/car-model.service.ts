import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import CreateCarModelDto from './dto/create-car-model.dto';
import UpdateCarModelDto from './dto/update-car-model.dto';
import { Knex } from 'knex';
import { CarModel, Reservation, User } from 'database/types';
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
export class CarModelService {
  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

  async checkCarModelExistById(id: Id): Promise<boolean> {
    try {
      let carModel = await this.knex<CarModel>('car_model')
        .select('id')
        .where('id', id)
        .andWhere('deleted', false);
      return Boolean(carModel);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAll(
    page: Page,
    limit: Limit,
    from: From,
    to: To,
  ): Promise<PaginationReturnType<CarModel[]>> {
    try {
      const carModels: CarModel[] = await this.knex
        .table<CarModel>('car_model')
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

      const { hasNextPage } = await generatePaginationInfo<CarModel>(
        this.knex<CarModel>('car_model'),
        page,
        limit,
        false,
      );
      return {
        paginatedData: carModels,
        meta: {
          nextPageUrl: hasNextPage
            ? `/localhost:3001?page=${Number(page) + 1}&limit=${limit}`
            : null,
          total: carModels.length,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getSelect(): Promise<CarModel[]> {
    try {
      const carModels: CarModel[] = await this.knex
        .table<CarModel>('car_model')
        .where('deleted', false)
        .select('*');

      return carModels;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getAllDeleted(
    page: Page,
    limit: Limit,
    from: From,
    to: To,
  ): Promise<PaginationReturnType<CarModel[]>> {
    try {
      const carModels: CarModel[] = await this.knex
        .table<CarModel>('car_model')
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

      const { hasNextPage } = await generatePaginationInfo<CarModel>(
        this.knex<CarModel>('car_model'),
        page,
        limit,
        true,
      );
      return {
        paginatedData: carModels,
        meta: {
          nextPageUrl: hasNextPage
            ? `/localhost:3001?page=${Number(page) + 1}&limit=${limit}`
            : null,
          total: carModels.length,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async search(search: Search): Promise<CarModel[]> {
    try {
      const carModels: CarModel[] = await this.knex
        .table<CarModel>('car_model')
        .where(function () {
          this.where('name', 'ilike', `%${search}%`);
        })
        .andWhere('deleted', false)
        .limit(ENUMs.SEARCH_LIMIT as number)
        .select('*');

      return carModels;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async deletedSearch(search: Search): Promise<CarModel[]> {
    try {
      const carModels: CarModel[] = await this.knex
        .table<CarModel>('car_model')
        .where(function () {
          this.where('name', 'ilike', `%${search}%`);
        })
        .andWhere('deleted', true)
        .limit(ENUMs.SEARCH_LIMIT as number)
        .select('*');

      return carModels;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async create(data: CreateCarModelDto): Promise<CarModel> {
    try {
      const carModel: CarModel[] = await this.knex<CarModel>('car_model')
        .insert({
          name: data.name,
        })
        .returning('*');

      return carModel[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(id: Id, data: UpdateCarModelDto): Promise<CarModel> {
    try {
      const carModel: CarModel[] = await this.knex
        .table<CarModel>('car_model')
        .where({ id })
        .update({
          name: data.name,
        })
        .returning('*');

      if (carModel.length === 0) {
        throw new NotFoundException(`ئەم داتایە بوونی نیە`);
      }

      return carModel[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async delete(id: Id): Promise<Id> {
    try {
      let check = await this.knex
        .table<Reservation>('reservation')
        .where('car_model_id', id)
        .count('id as count')
        .first();
      if (check.count != 0) {
        throw new BadRequestException('ناتوانی بیسڕیتەوە، چونکە بەکارهاتوە');
      }
      await this.knex
        .table<CarModel>('car_model')
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
        .table<CarModel>('car_model')
        .where('id', id)
        .update({ deleted: false });

      return id;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
