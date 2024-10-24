/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
import { Knex } from 'knex';

const customers = {
  name: 'نەقد',
  phone: '0000000000',
  created_by: 1,
  created_at: new Date(),
  updated_at: new Date(),
};

const seed = async function (knex: Knex) {
  await knex('customer').del();
  await knex('customer').insert(customers);
};

export { seed };
