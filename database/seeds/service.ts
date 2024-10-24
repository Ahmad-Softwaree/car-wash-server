/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
import { faker } from '@faker-js/faker';
import { Knex } from 'knex';

const services = Array.from({ length: 10 }, () => ({
  name: faker.company.name(), // Better suited for a service name
  price: 1000,
  created_at: new Date(),
  updated_at: new Date(),
}));

const seed = async function (knex: Knex) {
  await knex('service').del();
  await knex('service').insert(services);
};

export { seed };
