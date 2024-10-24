import knex, { Knex } from 'knex';
import * as development from './knexfile';
const db: Knex = knex(development);

export default db;
