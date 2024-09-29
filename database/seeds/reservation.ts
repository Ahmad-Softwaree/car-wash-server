/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
import { faker } from '@faker-js/faker';
import { Knex } from 'knex';

const reservations = Array.from({ length: 100 }, () => ({
  customer_id: faker.number.int({ min: 1, max: 50 }), // Assuming 50 customers
  color_id: faker.number.int({ min: 1, max: 10 }), // Assuming 10 colors
  service_id: faker.number.int({ min: 1, max: 5 }), // Assuming 5 services
  car_model_id: faker.number.int({ min: 1, max: 20 }), // Assuming 20 car models
  car_type_id: faker.number.int({ min: 1, max: 10 }), // Assuming 10 car types
  created_by: 1,

  note: faker.lorem.sentence(),
  price: faker.number.int({ min: 50, max: 1000 }), // Random price between 50 and 1000
  date_time: faker.date.between({ from: '2024-01-01', to: '2024-12-31' }), // Random date in 2024

  deleted: false,
  created_at: new Date(),
  updated_at: new Date(),
}));

const seed = async function (knex: Knex) {
  // Fetch IDs for foreign key relationships (assuming some entries exist)
  const customers = await knex('customer').select('id');
  const colors = await knex('color').select('id');
  const services = await knex('service').select('id');
  const carModels = await knex('car_model').select('id');
  const carTypes = await knex('car_type').select('id');

  if (
    !customers.length ||
    !colors.length ||
    !services.length ||
    !carModels.length ||
    !carTypes.length
  ) {
    throw new Error('Related foreign key records not found');
  }

  // Adjust each reservation to have valid foreign key IDs
  for (const reservation of reservations) {
    reservation.customer_id = faker.helpers.arrayElement(customers).id;
    reservation.color_id = faker.helpers.arrayElement(colors).id;
    reservation.service_id = faker.helpers.arrayElement(services).id;
    reservation.car_model_id = faker.helpers.arrayElement(carModels).id;
    reservation.car_type_id = faker.helpers.arrayElement(carTypes).id;
  }

  // Clear and insert new records into the reservation table
  await knex('reservation').del(); // Deletes all existing rows
  await knex('reservation').insert(reservations); // Insert the seed data
};

export { seed };
