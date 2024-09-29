import { Knex } from 'knex';
import { faker } from '@faker-js/faker';

// Helper function to generate unique car models
const generateUniqueCarModels = (count: number): string[] => {
  const uniqueModels = new Set<string>();

  while (uniqueModels.size < count) {
    uniqueModels.add(faker.vehicle.model());
  }

  return Array.from(uniqueModels);
};

const carModels = generateUniqueCarModels(10).map((model) => ({
  name: model,
  created_at: new Date(),
  updated_at: new Date(),
}));

const seed = async function (knex: Knex) {
  await knex('car_model').del();
  await knex('car_model').insert(carModels);
};

export { seed };
