import { Knex } from 'knex';
import { faker } from '@faker-js/faker';

// Helper function to generate unique vehicle types
const generateUniqueVehicleTypes = (count: number) => {
  const uniqueTypes = new Set<string>();

  while (uniqueTypes.size < count) {
    uniqueTypes.add(faker.vehicle.type());
  }

  return Array.from(uniqueTypes);
};

const vehicles = generateUniqueVehicleTypes(10).map((type) => ({
  name: type,
  created_at: new Date(),
  updated_at: new Date(),
}));

const seed = async function (knex: Knex) {
  await knex('car_type').del();
  await knex('car_type').insert(vehicles);
};

export { seed };
