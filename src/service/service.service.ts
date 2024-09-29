import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import CreateServiceDto from './dto/create-service.dto';
import UpdateServiceDto from './dto/update-service.dto';
import { Knex } from 'knex';
import { Reservation, Service, User } from 'database/types';
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
export class ServiceService {
  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

  async checkServiceExistById(id: Id): Promise<boolean> {
    try {
      let service = await this.knex<Service>('service')
        .select('id')
        .where('id', id)
        .andWhere('deleted', false);
      return Boolean(service);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAll(
    page: Page,
    limit: Limit,
    from: From,
    to: To,
  ): Promise<PaginationReturnType<Service[]>> {
    try {
      const service: Service[] = await this.knex
        .table<Service>('service')
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

      const { hasNextPage } = await generatePaginationInfo<Service>(
        this.knex<Service>('service'),
        page,
        limit,
        false,
      );
      return {
        paginatedData: service,
        meta: {
          nextPageUrl: hasNextPage
            ? `/localhost:3001?page=${Number(page) + 1}&limit=${limit}`
            : null,
          total: service.length,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getSelect(): Promise<Service[]> {
    try {
      const service: Service[] = await this.knex
        .table<Service>('service')
        .where('deleted', false)
        .select('*');

      return service;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getAllDeleted(
    page: Page,
    limit: Limit,
    from: From,
    to: To,
  ): Promise<PaginationReturnType<Service[]>> {
    try {
      const service: Service[] = await this.knex
        .table<Service>('service')
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

      const { hasNextPage } = await generatePaginationInfo<Service>(
        this.knex<Service>('service'),
        page,
        limit,
        true,
      );
      return {
        paginatedData: service,
        meta: {
          nextPageUrl: hasNextPage
            ? `/localhost:3001?page=${Number(page) + 1}&limit=${limit}`
            : null,
          total: service.length,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async search(search: Search): Promise<Service[]> {
    try {
      const service: Service[] = await this.knex
        .table<Service>('service')
        .where(function () {
          this.where('name', 'ilike', `%${search}%`);
        })
        .andWhere('deleted', false)
        .limit(ENUMs.SEARCH_LIMIT as number)
        .select('*');

      return service;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async deletedSearch(search: Search): Promise<Service[]> {
    try {
      const service: Service[] = await this.knex
        .table<Service>('service')
        .where(function () {
          this.where('name', 'ilike', `%${search}%`);
        })
        .andWhere('deleted', true)
        .limit(ENUMs.SEARCH_LIMIT as number)
        .select('*');

      return service;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async create(data: CreateServiceDto): Promise<Service> {
    try {
      const service: Service[] = await this.knex<Service>('service')
        .insert({
          name: data.name,
        })
        .returning('*');

      return service[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(id: Id, data: UpdateServiceDto): Promise<Service> {
    try {
      const service: Service[] = await this.knex
        .table<Service>('service')
        .where({ id })
        .update({
          name: data.name,
        })
        .returning('*');

      if (service.length === 0) {
        throw new NotFoundException(`Service with ID ${id} not found`);
      }

      return service[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async delete(id: Id): Promise<Id> {
    try {
      let check = await this.knex
        .table<Reservation>('reservation')
        .where('service_id', id)
        .count('id as count')
        .first();
      if (check.count != 0) {
        throw new BadRequestException('ناتوانی بیسڕیتەوە، چونکە بەکارهاتوە');
      }
      await this.knex
        .table<Service>('service')
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
        .table<Service>('service')
        .where('id', id)
        .update({ deleted: false });

      return id;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
