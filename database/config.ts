import knex, { Knex } from 'knex';
import { development, production } from './knexfile';

const db: Knex = knex(
  process.env.STAGE == 'development' ? development : production,
);

// updateTypes(db, { output: './database/types.ts' })
//   .then(() => {
//     console.log('TypeScript types updated successfully');
//     process.exit(0);
//   })
//   .catch((err) => {
//     console.error('Error updating TypeScript types:', err);
//     process.exit(1);
//   });

export default db;
