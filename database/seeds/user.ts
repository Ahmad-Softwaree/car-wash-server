/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';
import { Role } from 'database/types';
import { Knex } from 'knex';

const generatePasswordHash = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(16);
  return bcrypt.hash(password, salt);
};

const users = Array.from({ length: 10 }, () => ({
  name: faker.person.fullName(),
  username: faker.internet.userName(),
  password: faker.internet.password(),
  phone: '077012312334',
  role_id: 1,
  is_active: true,
  created_at: new Date(),
  updated_at: new Date(),
}));

users.push({
  name: 'Ahmad Software',
  username: 'ahmadSoftware',
  password: 'aghlqtyo',
  phone: '07701993085',
  role_id: 1,
  is_active: true,
  created_at: new Date(),
  updated_at: new Date(),
});

const seed = async function (knex: Knex) {
  // Fetch the role with the name 'ئەدمین'
  const role = await knex<Role>('role').where({ name: 'ئەدمین' }).first();

  if (!role) {
    throw new Error("Role 'ئەدمین' not found");
  }

  // Hash passwords and assign role_id
  for (const user of users) {
    user.password = await generatePasswordHash(user.password);
    user.role_id = role.id;
  }

  await knex('user').del();
  await knex('user').insert(users);
};

export { seed };
