import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reservation } from 'database/types';
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
import { PanelReservation } from 'src/types/reservation';
import UpdateReservationDto from './dto/update-reservation.dto';
import CreateReservationDto from './dto/create-reservation.dto';
import { generatePaginationInfo, timestampToDateString } from 'lib/functions';

@Injectable()
export class ReservationService {
  constructor(@Inject('KnexConnection') private readonly knex: Knex) {}

  async getPanel(date: Date): Promise<PanelReservation[]> {
    try {
      let validDate: Date;

      // If the date is a string, convert it to a Date object
      if (typeof date === 'string') {
        validDate = new Date(date); // Convert string to Date object
      } else {
        validDate = date; // It's already a Date object
      }

      const year = validDate.getFullYear(); // Extract the year
      const month = validDate.getUTCMonth(); // Extract the month (0-based)

      const result = await this.knex.raw(
        `
  WITH RankedReservations AS (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY DATE(date_time) ORDER BY date_time) AS rn
    FROM "reservation"
    WHERE EXTRACT(YEAR FROM date_time) = ?
      AND EXTRACT(MONTH FROM date_time) = ?
      AND "deleted" = false -- Filter out deleted reservations
  ),
  DailyCounts AS (
    SELECT 
      DATE(date_time) AS reservation_date,
      COUNT(*)::int AS total_reservations, -- Total reservations per day
      COUNT(CASE WHEN completed = true THEN 1 END)::int AS completed_reservations, -- Completed reservations per day
      COUNT(CASE WHEN completed = false THEN 1 END)::int AS not_completed_reservations -- Not completed reservations per day
    FROM "reservation"
    WHERE EXTRACT(YEAR FROM date_time) = ?
      AND EXTRACT(MONTH FROM date_time) = ?
      AND "deleted" = false
    GROUP BY DATE(date_time)
  )
  SELECT r.id AS id,
         r.date_time AS date_time,
         c.first_name AS customer_name,
         dc.total_reservations, -- Total reservations per day
         dc.completed_reservations, -- Completed reservations per day
         dc.not_completed_reservations -- Not completed reservations per day
  FROM RankedReservations r
  JOIN "customer" c ON r.customer_id = c.id
  JOIN DailyCounts dc ON DATE(r.date_time) = dc.reservation_date
  WHERE r.rn <= ?
  ORDER BY r.date_time ASC;
  `,
        [year, month, year, month, 3], // Adjust 3 as needed for the row limit
      );

      return result.rows;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAll(
    page: Page,
    limit: Limit,
    date: Date,
    filter: Filter,
    colorFilter: Filter,
    carModelFilter: Filter,
    carTypeFilter: Filter,
    serviceFilter: Filter,
    userFilter: Filter,
  ): Promise<PaginationReturnType<Reservation[]>> {
    try {
      let validDate: Date;
      // If the date is a string, convert it to a Date object
      if (typeof date === 'string') {
        validDate = new Date(date); // Convert string to Date object
      } else {
        validDate = date; // It's already a Date object
      }
      const year = validDate.getFullYear(); // Extract the year
      const month = validDate.getUTCMonth() + 1; // Extract the month (0-based)
      const day = validDate.getUTCDate(); // Extract the day
      // Adjust month to be 2-digit format

      const reservations: Reservation[] = await this.knex<Reservation>(
        'reservation',
      )
        .select(
          'reservation.*',
          'car_model.name as car_model_name',
          'car_type.name as car_type_name',
          'color.name as color_name',
          'service.name as service_name',
          'customer.first_name as customer_first_name',
          'customer.last_name as customer_last_name',
          'createdUser.username as created_by', // Alias for created_by user
          'updatedUser.username as updated_by', // Alias for updated_by user
        )
        .leftJoin(
          'user as createdUser',
          'reservation.created_by',
          'createdUser.id',
        ) // Join for created_by
        .leftJoin(
          'user as updatedUser',
          'reservation.updated_by',
          'updatedUser.id',
        ) // Join for updated_by
        .leftJoin('car_model', 'reservation.car_model_id', 'car_model.id')
        .leftJoin('car_type', 'reservation.car_type_id', 'car_type.id')
        .leftJoin('color', 'reservation.color_id', 'color.id')
        .leftJoin('service', 'reservation.service_id', 'service.id')
        .leftJoin('customer', 'reservation.customer_id', 'customer.id')
        .offset((page - 1) * limit)
        .where('reservation.deleted', false)
        .andWhere(function () {
          // Filtering by month and year
          this.whereRaw('EXTRACT(YEAR FROM reservation.date_time) = ?', [year])
            .andWhereRaw('EXTRACT(MONTH FROM reservation.date_time) = ?', [
              month,
            ])
            .andWhereRaw('EXTRACT(DAY FROM reservation.date_time) = ?', [day]);
        })
        .andWhere(function () {
          if (colorFilter != '' && colorFilter) {
            this.where('color.id', colorFilter);
          }
          if (carModelFilter != '' && carModelFilter) {
            this.where('car_model.id', carModelFilter);
          }
          if (carTypeFilter != '' && carTypeFilter) {
            this.where('car_type.id', carTypeFilter);
          }
          if (serviceFilter != '' && serviceFilter) {
            this.where('service.id', serviceFilter);
          }
          if (userFilter != '' && userFilter) {
            this.where('createdUser.id', userFilter).orWhere(
              'updatedUser.id',
              userFilter,
            );
          }
          if (filter != '' && filter) {
            if (filter == 'all') return true;
            if (filter == 'completed') {
              return this.where('reservation.completed', true);
            }
            if (filter == 'not_completed') {
              return this.where('reservation.completed', false);
            }
          }
        })
        .limit(limit)
        .orderBy('id', 'desc');

      const { hasNextPage } = await generatePaginationInfo<Reservation>(
        this.knex<Reservation>('reservation'),
        page,
        limit,
        false,
        true,
        year,
        month,
        day,
      );
      return {
        paginatedData: reservations,
        meta: {
          nextPageUrl: hasNextPage
            ? `/localhost:3001?page=${Number(page) + 1}&limit=${limit}`
            : null,
          total: reservations.length,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getAllDeleted(
    page: Page,
    limit: Limit,
    from: From,
    to: To,
    filter: Filter,
    colorFilter: Filter,
    carModelFilter: Filter,
    carTypeFilter: Filter,
    serviceFilter: Filter,
    userFilter: Filter,
  ): Promise<PaginationReturnType<Reservation[]>> {
    try {
      const reservations: Reservation[] = await this.knex<Reservation>(
        'reservation',
      )
        .select(
          'reservation.*',
          'car_model.name as car_model_name',
          'car_type.name as car_type_name',
          'color.name as color_name',
          'service.name as service_name',
          'customer.first_name as customer_first_name',
          'customer.last_name as customer_last_name',
          'createdUser.username as created_by', // Alias for created_by user
          'updatedUser.username as updated_by', // Alias for updated_by user
        )
        .leftJoin('car_model', 'reservation.car_model_id', 'car_model.id')
        .leftJoin('car_type', 'reservation.car_type_id', 'car_type.id')
        .leftJoin('color', 'reservation.color_id', 'color.id')
        .leftJoin('service', 'reservation.service_id', 'service.id')
        .leftJoin('customer', 'reservation.customer_id', 'customer.id')
        .leftJoin(
          'user as createdUser',
          'reservation.created_by',
          'createdUser.id',
        ) // Join for created_by
        .leftJoin(
          'user as updatedUser',
          'reservation.updated_by',
          'updatedUser.id',
        ) // Join for updated_by
        .offset((page - 1) * limit)
        .where('reservation.deleted', true)
        .andWhere(function () {
          if (from != '' && from && to != '' && to) {
            const fromDate = timestampToDateString(Number(from));
            const toDate = timestampToDateString(Number(to));
            this.whereBetween('reservation.date_time', [fromDate, toDate]);
          }
        })
        .andWhere(function () {
          if (colorFilter != '' && colorFilter) {
            this.where('color.id', colorFilter);
          }
          if (carModelFilter != '' && carModelFilter) {
            this.where('car_model.id', carModelFilter);
          }
          if (carTypeFilter != '' && carTypeFilter) {
            this.where('car_type.id', carTypeFilter);
          }
          if (serviceFilter != '' && serviceFilter) {
            this.where('service.id', serviceFilter);
          }
          if (userFilter != '' && userFilter) {
            this.where('createdUser.id', userFilter).orWhere(
              'updatedUser.id',
              userFilter,
            );
          }
          if (filter != '' && filter) {
            if (filter == 'all') return true;
            if (filter == 'completed') {
              return this.where('reservation.completed', true);
            }
            if (filter == 'not_completed') {
              return this.where('reservation.completed', false);
            }
          }
        })
        .limit(limit)
        .orderBy('id', 'desc');

      const { hasNextPage } = await generatePaginationInfo<Reservation>(
        this.knex<Reservation>('reservation'),
        page,
        limit,
        true,
        false,
      );
      return {
        paginatedData: reservations,
        meta: {
          nextPageUrl: hasNextPage
            ? `/localhost:3001?page=${Number(page) + 1}&limit=${limit}`
            : null,
          total: reservations.length,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async findOne(id: Id): Promise<Reservation> {
    try {
      // Fetch reservation and related role and parts
      let reservation: Reservation = await this.knex<Reservation>('reservation')
        .select(
          'reservation.*',
          'car_model.name as car_model_name',
          'car_type.name as car_type_name',
          'color.name as color_name',
          'service.name as service_name',
          'customer.first_name as customer_first_name',
          'customer.last_name as customer_last_name',
          'createdUser.username as created_by', // Alias for created_by user
          'updatedUser.username as updated_by', // Alias for updated_by user
        )
        .leftJoin('car_model', 'reservation.car_model_id', 'car_model.id')
        .leftJoin('car_type', 'reservation.car_type_id', 'car_type.id')
        .leftJoin('color', 'reservation.color_id', 'color.id')
        .leftJoin('service', 'reservation.service_id', 'service.id')
        .leftJoin('customer', 'reservation.customer_id', 'customer.id')
        .leftJoin(
          'user as createdUser',
          'reservation.created_by',
          'createdUser.id',
        ) // Join for created_by
        .leftJoin(
          'user as updatedUser',
          'reservation.updated_by',
          'updatedUser.id',
        ) // Join for updated_by
        .where('reservation.id', id)
        .andWhere('reservation.deleted', false)
        .first();
      if (!reservation) {
        throw new NotFoundException(`ئەم داتایە بوونی نیە`);
      }

      return reservation;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async search(search: Search, date: Date): Promise<Reservation[]> {
    try {
      let validDate: Date;

      // If the date is a string, convert it to a Date object
      if (typeof date === 'string') {
        validDate = new Date(date); // Convert string to Date object
      } else {
        validDate = date; // It's already a Date object
      }

      const year = validDate.getFullYear(); // Extract the year
      const month = validDate.getUTCMonth() + 1; // Extract the month (0-based)
      const day = validDate.getUTCDate();
      const reservations: Reservation[] = await this.knex<Reservation>(
        'reservation',
      )
        .select(
          'reservation.*',
          'car_model.name as car_model_name',
          'car_type.name as car_type_name',
          'color.name as color_name',
          'service.name as service_name',
          'customer.first_name as customer_first_name',
          'customer.last_name as customer_last_name',
          'createdUser.username as created_by', // Alias for created_by user
          'updatedUser.username as updated_by', // Alias for updated_by user
        )
        .leftJoin('car_model', 'reservation.car_model_id', 'car_model.id')
        .leftJoin('car_type', 'reservation.car_type_id', 'car_type.id')
        .leftJoin('color', 'reservation.color_id', 'color.id')
        .leftJoin('service', 'reservation.service_id', 'service.id')
        .leftJoin('customer', 'reservation.customer_id', 'customer.id')
        .leftJoin(
          'user as createdUser',
          'reservation.created_by',
          'createdUser.id',
        ) // Join for created_by
        .leftJoin(
          'user as updatedUser',
          'reservation.updated_by',
          'updatedUser.id',
        ) // Join for updated_by
        .where(function () {
          this.whereRaw('CAST(reservation.id AS TEXT) ILIKE ?', [`%${search}%`])
            .orWhere('customer.first_name', 'ilike', `%${search}%`)
            .orWhere('customer.last_name', 'ilike', `%${search}%`)
            .orWhere('service.name', 'ilike', `%${search}%`)
            .orWhere('color.name', 'ilike', `%${search}%`)
            .orWhere('car_model.name', 'ilike', `%${search}%`)
            .orWhere('car_type.name', 'ilike', `%${search}%`);
        })
        .andWhere(function () {
          // Filtering by month and year
          this.whereRaw('EXTRACT(YEAR FROM reservation.date_time) = ?', [year])
            .andWhereRaw('EXTRACT(MONTH FROM reservation.date_time) = ?', [
              month,
            ])
            .andWhereRaw('EXTRACT(DAY FROM reservation.date_time) = ?', [day]);
        })
        .andWhere('reservation.deleted', false)
        .limit(30);

      return reservations;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async deletedSearch(search: Search): Promise<Reservation[]> {
    try {
      const reservations: Reservation[] = await this.knex<Reservation>(
        'reservation',
      )
        .select(
          'reservation.*',
          'car_model.name as car_model_name',
          'car_type.name as car_type_name',
          'color.name as color_name',
          'service.name as service_name',
          'customer.first_name as customer_first_name',
          'customer.last_name as customer_last_name',
          'createdUser.username as created_by', // Alias for created_by user
          'updatedUser.username as updated_by', // Alias for updated_by user
        )
        .leftJoin('car_model', 'reservation.car_model_id', 'car_model.id')
        .leftJoin('car_type', 'reservation.car_type_id', 'car_type.id')
        .leftJoin('color', 'reservation.color_id', 'color.id')
        .leftJoin('service', 'reservation.service_id', 'service.id')
        .leftJoin('customer', 'reservation.customer_id', 'customer.id')
        .leftJoin(
          'user as createdUser',
          'reservation.created_by',
          'createdUser.id',
        ) // Join for created_by
        .leftJoin(
          'user as updatedUser',
          'reservation.updated_by',
          'updatedUser.id',
        ) // Join for updated_by
        .where(function () {
          this.whereRaw('CAST(reservation.id AS TEXT) ILIKE ?', [`%${search}%`])
            .orWhere('customer.first_name', 'ilike', `%${search}%`)
            .orWhere('customer.last_name', 'ilike', `%${search}%`)
            .orWhere('service.name', 'ilike', `%${search}%`)
            .orWhere('color.name', 'ilike', `%${search}%`)
            .orWhere('car_model.name', 'ilike', `%${search}%`)
            .orWhere('car_type.name', 'ilike', `%${search}%`);
        })
        .andWhere('reservation.deleted', true)
        .limit(30);

      return reservations;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async create(
    data: CreateReservationDto,
    user_id: number,
  ): Promise<Reservation> {
    try {
      const reservation: Reservation[] = await this.knex<Reservation>(
        'reservation',
      )
        .insert({ created_by: user_id, ...data })
        .returning('*');
      return reservation[0];
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(
    id: Id,
    data: UpdateReservationDto,
    user_id: number,
  ): Promise<Reservation> {
    try {
      const result: Reservation[] = await this.knex<Reservation>('reservation')
        .where('id', id)
        .update({ updated_by: user_id, ...data })
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
      await this.knex<Reservation>('reservation')
        .where('id', id)
        .update({ deleted: true });
      return id;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async restore(id: Id): Promise<Id> {
    try {
      await this.knex<Reservation>('reservation')
        .where('id', id)
        .update({ deleted: false });
      return id;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async complete(id: Id, complete: boolean): Promise<Id> {
    try {
      await this.knex<Reservation>('reservation')
        .where('id', id)
        .update({ completed: complete });
      return id;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
