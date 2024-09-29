import { Knex } from 'knex';

const development: Knex.Config = {
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'aghlqtyo2018#',
    database: 'raha_auto_spa_system',
  },
  seeds: {
    directory: './seeds',
  },
  pool: {
    min: 2,
    max: 20, // Increase the maximum number of connections
  },
  migrations: {
    directory: './migrations',
  },
};

const production: Knex.Config = {
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'raha_auto_spa_system',
  },
  seeds: {
    directory: './seeds',
  },
  pool: {
    min: 2,
    max: 20, // Increase the maximum number of connections
  },
  migrations: {
    directory: './migrations',
  },
};

export { development, production };
