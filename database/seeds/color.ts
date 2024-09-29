import { Knex } from 'knex';
import { faker } from '@faker-js/faker';

// Helper function to generate unique color names
const generateUniqueColors = (count: number): string[] => {
  const uniqueColors = new Set<string>();

  while (uniqueColors.size < count) {
    uniqueColors.add(faker.internet.color());
  }

  return Array.from(uniqueColors);
};

const colors = generateUniqueColors(10).map((color) => ({
  name: color,
  created_at: new Date(),
  updated_at: new Date(),
}));

const seed = async function (knex: Knex) {
  await knex('color').del();
  await knex('color').insert(colors);
};

export { seed };
