/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
import { faker } from '@faker-js/faker';
import { ItemType } from 'database/types';
import { Knex } from 'knex';

const items = Array.from({ length: 10 }, () => ({
  name: faker.commerce.productName(),
  barcode: faker.string.alphanumeric(12),
  type_id: 1,
  quantity: faker.number.int({ min: 0, max: 1000 }),
  item_purchase_price: faker.number.int({ min: 0, max: 1000 }),
  item_sell_price: faker.number.int({ min: 0, max: 1000 }),
  created_by: 1,
  item_less_from: 10,
  note: faker.lorem.sentence(),
  deleted: false,
  created_at: new Date(),
  updated_at: new Date(),
}));

const seed = async function (knex: Knex) {
  // Fetch the itemType with the name 'ئەدمین'
  const itemType = await knex<ItemType>('item_type').first();

  if (!itemType) {
    throw new Error('Item Type Not Found');
  }
  for (const item of items) {
    item.type_id = itemType.id;
  }
  await knex('item').del();
  await knex('item').insert(items);
};

export { seed };
