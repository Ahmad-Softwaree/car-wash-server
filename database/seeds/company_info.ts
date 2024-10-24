/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
import { Knex } from 'knex';

const company_info = {
  created_at: new Date(),
  updated_at: new Date(),
};

const seed = async function (knex: Knex) {
  await knex('company_info').del();
  await knex('company_info').insert(company_info);
};

export { seed };
