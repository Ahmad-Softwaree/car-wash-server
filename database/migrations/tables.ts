import { Knex } from 'knex';

const up: (knex: Knex) => Promise<void> = function (knex) {
  return knex.schema
    .createTable('role', function (table) {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
      table.boolean('deleted').defaultTo(false);
      table.timestamps({ defaultToNow: true });
    })

    .createTable('part', function (table) {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
      table.boolean('deleted').defaultTo(false);
      table.timestamps({ defaultToNow: true });
    })

    .createTable('role_part', function (table) {
      table.increments('id').primary();
      table.integer('role_id').unsigned().notNullable();
      table.integer('part_id').unsigned().notNullable();
      table
        .foreign('role_id')
        .references('id')
        .inTable('role')
        .onDelete('RESTRICT');
      table
        .foreign('part_id')
        .references('id')
        .inTable('part')
        .onDelete('RESTRICT');
      table.boolean('deleted').defaultTo(false);
      table.timestamps({ defaultToNow: true });
    })
    .createTable('user', function (table) {
      table.increments('id').primary();
      table.string('name', 255).notNullable();

      table.string('phone', 255).notNullable();
      table.string('username', 255).notNullable().unique();
      table.string('password', 255).notNullable();

      table.boolean('is_active').defaultTo(true).notNullable();
      table.integer('role_id').unsigned().notNullable();
      table
        .foreign('role_id')
        .references('id')
        .inTable('role')
        .onDelete('RESTRICT');
      table.boolean('deleted').defaultTo(false);
      table.timestamps({ defaultToNow: true });
    })

    .createTable('user_part', function (table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.integer('part_id').unsigned().notNullable();
      table
        .foreign('user_id')
        .references('id')
        .inTable('user')
        .onDelete('RESTRICT');
      table
        .foreign('part_id')
        .references('id')
        .inTable('part')
        .onDelete('RESTRICT');
      table.boolean('deleted').defaultTo(false);
      table.timestamps({ defaultToNow: true });
    })
    .createTable('service', function (table) {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
      table.boolean('deleted').defaultTo(false);
      table.timestamps({ defaultToNow: true });
    })
    .createTable('color', function (table) {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
      table.boolean('deleted').defaultTo(false);
      table.timestamps({ defaultToNow: true });
    })
    .createTable('car_type', function (table) {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
      table.boolean('deleted').defaultTo(false);
      table.timestamps({ defaultToNow: true });
    })
    .createTable('item_type', function (table) {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
      table.boolean('deleted').defaultTo(false);
      table.timestamps({ defaultToNow: true });
    })
    .createTable('car_model', function (table) {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
      table.boolean('deleted').defaultTo(false);
      table.timestamps({ defaultToNow: true });
    })
    .createTable('expense_type', function (table) {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
      table.boolean('deleted').defaultTo(false);
      table.timestamps({ defaultToNow: true });
    })
    .createTable('expense', function (table) {
      table.increments('id').primary();
      table.integer('created_by').unsigned().notNullable();
      table.integer('updated_by').unsigned();

      table
        .foreign('created_by')
        .references('id')
        .inTable('user')
        .onDelete('RESTRICT');

      table
        .foreign('updated_by')
        .references('id')
        .inTable('user')
        .onDelete('RESTRICT');
      table.integer('type_id').unsigned().notNullable();
      table
        .foreign('type_id')
        .references('id')
        .inTable('expense_type')
        .onDelete('RESTRICT');
      table.integer('price').notNullable();
      table.date('date').notNullable();
      table.string('note').notNullable();

      table.boolean('deleted').defaultTo(false);
      table.timestamps({ defaultToNow: true });
    })
    .createTable('item', function (table) {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
      table.string('barcode').notNullable().unique();
      table.string('image_name').defaultTo('');
      table.string('image_url').defaultTo('');
      table.integer('type_id').unsigned().notNullable();
      table
        .foreign('type_id')
        .references('id')
        .inTable('item_type')
        .onDelete('RESTRICT');
      table.integer('created_by').unsigned().notNullable();
      table.integer('updated_by').unsigned();

      table
        .foreign('created_by')
        .references('id')
        .inTable('user')
        .onDelete('RESTRICT');

      table
        .foreign('updated_by')
        .references('id')
        .inTable('user')
        .onDelete('RESTRICT');
      table.integer('quantity').notNullable().defaultTo(0);
      table.integer('item_purchase_price').notNullable().defaultTo(0);
      table.integer('item_less_from').notNullable().defaultTo(0);
      table.integer('item_sell_price').notNullable().defaultTo(0);
      table.string('note').notNullable();
      table.boolean('deleted').defaultTo(false);
      table.timestamps({ defaultToNow: true });
    })
    .createTable('sell', function (table) {
      table.increments('id').primary();
      table.integer('discount').notNullable().defaultTo(0);
      table.integer('created_by').unsigned().notNullable();
      table.integer('updated_by').unsigned();

      table
        .foreign('created_by')
        .references('id')
        .inTable('user')
        .onDelete('RESTRICT');

      table
        .foreign('updated_by')
        .references('id')
        .inTable('user')
        .onDelete('RESTRICT');
      table.dateTime('date').notNullable().defaultTo(knex.fn.now());
      table.boolean('deleted').defaultTo(false);
      table.timestamps({ defaultToNow: true });
    })
    .createTable('sell_item', function (table) {
      table.increments('id').primary();
      table.integer('sell_id').unsigned().notNullable();
      table.integer('created_by').unsigned().notNullable();
      table
        .foreign('created_by')
        .references('id')
        .inTable('user')
        .onDelete('RESTRICT');
      table.integer('updated_by').unsigned();

      table
        .foreign('updated_by')
        .references('id')
        .inTable('user')
        .onDelete('RESTRICT');
      table
        .foreign('sell_id')
        .references('id')
        .inTable('sell')
        .onDelete('RESTRICT');
      table.integer('item_id').unsigned().notNullable();
      table
        .foreign('item_id')
        .references('id')
        .inTable('item')
        .onDelete('RESTRICT');
      table.integer('quantity').notNullable().defaultTo(0);
      table.integer('item_purchase_price').notNullable().defaultTo(0);
      table.integer('item_sell_price').notNullable().defaultTo(0);
      table.boolean('deleted').defaultTo(false);
      table.boolean('self_deleted').defaultTo(false);
      table.timestamps({ defaultToNow: true });
    })
    .createTable('item_quantity_history', function (table) {
      table.increments('id').primary();
      table.integer('created_by').unsigned().notNullable();
      table
        .foreign('created_by')
        .references('id')
        .inTable('user')
        .onDelete('RESTRICT');
      table.integer('item_id').unsigned().notNullable();
      table
        .foreign('item_id')
        .references('id')
        .inTable('item')
        .onDelete('RESTRICT');
      table.integer('quantity').notNullable().defaultTo(0);
      table.integer('item_purchase_price').notNullable().defaultTo(0);
      table.boolean('deleted').defaultTo(false);
      table.integer('item_sell_price').notNullable().defaultTo(0);
      table.timestamps({ defaultToNow: true });
    })
    .createTable('customer', function (table) {
      table.increments('id').primary();
      table.string('first_name', 255).notNullable();
      table.string('last_name', 255).notNullable();
      table.integer('created_by').unsigned().notNullable();
      table.integer('updated_by').unsigned();

      table
        .foreign('created_by')
        .references('id')
        .inTable('user')
        .onDelete('RESTRICT');

      table
        .foreign('updated_by')
        .references('id')
        .inTable('user')
        .onDelete('RESTRICT');
      table.string('phone', 255).notNullable();
      table.boolean('deleted').defaultTo(false);
      table.timestamps({ defaultToNow: true });
    })
    .createTable('reservation', function (table) {
      table.increments('id').primary();
      table.boolean('completed').defaultTo(false);
      table.integer('created_by').unsigned().notNullable();
      table.integer('updated_by').unsigned();

      table
        .foreign('created_by')
        .references('id')
        .inTable('user')
        .onDelete('RESTRICT');

      table
        .foreign('updated_by')
        .references('id')
        .inTable('user')
        .onDelete('RESTRICT');
      table.integer('customer_id').unsigned().notNullable();
      table
        .foreign('customer_id')
        .references('id')
        .inTable('customer')
        .onDelete('RESTRICT');

      table.integer('color_id').unsigned().notNullable();
      table
        .foreign('color_id')
        .references('id')
        .inTable('color')
        .onDelete('RESTRICT');

      table.integer('service_id').unsigned().notNullable();
      table
        .foreign('service_id')
        .references('id')
        .inTable('service')
        .onDelete('RESTRICT');

      table.integer('car_model_id').unsigned().notNullable();
      table
        .foreign('car_model_id')
        .references('id')
        .inTable('car_model')
        .onDelete('RESTRICT');

      table.integer('car_type_id').unsigned().notNullable();
      table
        .foreign('car_type_id')
        .references('id')
        .inTable('car_type')
        .onDelete('RESTRICT');
      table.string('note');
      table.integer('price').notNullable();
      table.dateTime('date_time').notNullable();

      table.boolean('deleted').defaultTo(false);
      table.timestamps({ defaultToNow: true });
    })
    .createTable('backup', function (table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable();
      table
        .foreign('user_id')
        .references('id')
        .inTable('user')
        .onDelete('RESTRICT');
      table.string('table', 255).notNullable();
      table.boolean('deleted').defaultTo(false);

      table.timestamps({ defaultToNow: true });
    })
    .createTable('printer', function (table) {
      table.increments('id').primary();

      table.string('name', 255).notNullable();
      table.boolean('active').defaultTo(false);
      table.boolean('deleted').defaultTo(false);
      table.timestamps({ defaultToNow: true });
    })
    .createTable('config', (table) => {
      table.increments('id').primary();
      table.integer('item_less_from').defaultTo(15);
      table.float('initial_money').defaultTo(0);
      table.boolean('deleted').defaultTo(false);
      table.timestamps({ defaultToNow: true });
    });
};

const down: (knex: Knex) => Promise<void> = async function (knex) {
  const databaseName = knex.client.database();

  await knex.raw(`SET FOREIGN_KEY_CHECKS = 0;`);
  const tables = await knex.raw('SHOW TABLES');
  const tableNames = tables[0].map((row: any) => Object.values(row)[0]);

  for (const tableName of tableNames) {
    await knex.raw(`DROP TABLE IF EXISTS \`${tableName}\`;`);
  }

  // Optional: Drop the entire database if required
  // await knex.raw(`DROP DATABASE IF EXISTS \`${databaseName}\`;`);

  await knex.raw(`SET FOREIGN_KEY_CHECKS = 1;`);
};

export { up, down };
