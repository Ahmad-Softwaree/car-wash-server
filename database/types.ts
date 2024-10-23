export enum Table {
  KnexMigrations = 'knex_migrations',
  KnexMigrationsLock = 'knex_migrations_lock',
  Part = 'part',
  Role = 'role',
  User = 'user',
  UserPart = 'user_part',
  Service = 'service',
  Color = 'color',
  CarType = 'car_type',
  CarModel = 'car_model',
  ExpenseType = 'expense_type',
  Expense = 'expense',
  Item = 'item',
  Sell = 'sell',
  SellItem = 'sell_item',
  Reservation = 'reservation',
  Customer = 'customer',
}

export type Tables = {
  knex_migrations: KnexMigrations;
  knex_migrations_lock: KnexMigrationsLock;
  part: Part;
  role: Role;
  user: User;
  user_part: UserPart;
  service: Service;
  color: Color;
  car_type: CarType;
  car_model: CarModel;
  expense_type: ExpenseType;
  expense: Expense;
  item: Item;
  sell: Sell;
  sell_item: SellItem;
  reservation: Reservation;
  customer: Customer;
};
export type KnexMigrations = {
  id: number;
  name: string | null;
  batch: number | null;
  migration_time: Date | null;
  deleted: boolean;
};

export type KnexMigrationsLock = {
  index: number;
  is_locked: number | null;
  deleted: boolean;
};
export type User = {
  id: number;
  name: string;
  username: string;
  password: string;
  phone: string;
  role_id: number;
  created_at: Date | null;
  updated_at: Date | null;
  deleted: boolean;
};

export type UserPart = {
  id: number;
  user_id: number;
  part_id: number;
  created_at: Date | null;
  updated_at: Date | null;
  deleted: boolean;
};

export type Part = {
  id: number;
  name: string;
  created_at: Date | null;
  updated_at: Date | null;
  deleted: boolean;
};

export type Role = {
  id: number;
  name: string;
  created_at: Date | null;
  updated_at: Date | null;
  deleted: boolean;
};

export type RolePart = {
  id: number;
  role_id: number;
  part_id: number;
  created_at: Date | null;
  updated_at: Date | null;
  deleted: boolean;
};

export type Service = {
  id: number;
  name: string;
  created_at: Date | null;
  updated_at: Date | null;
  deleted: boolean;
};

export type Color = {
  id: number;
  name: string;
  created_at: Date | null;
  updated_at: Date | null;
  deleted: boolean;
};

export type CarType = {
  id: number;
  name: string;
  created_at: Date | null;
  updated_at: Date | null;
  deleted: boolean;
};

export type CarModel = {
  id: number;
  name: string;
  created_at: Date | null;
  updated_at: Date | null;
  deleted: boolean;
};
export type ItemType = {
  id: number;
  name: string;
  created_at: Date | null;
  updated_at: Date | null;
  deleted: boolean;
};
export type ExpenseType = {
  id: number;
  name: string;
  created_at: Date | null;
  updated_at: Date | null;
  deleted: boolean;
};

export type Expense = {
  id: number;
  type_id: number;
  price: number;
  date: Date | string;
  note: string;
  created_at: Date | null;
  updated_at: Date | null;
  created_by: number;
  updated_by: number;
  deleted: boolean;
};

export type Item = {
  id: number;
  name: string;
  barcode: string;
  type_id: number;
  type_name: string;
  quantity: number;
  item_purchase_price: number;
  item_less_from: number;
  item_sell_price: number;
  image_name: string;
  image_url: string;
  note: string;
  created_at: Date | null;
  updated_at: Date | null;
  created_by: number;
  updated_by: number;
  deleted: boolean;
};

export type Sell = {
  id: number;
  discount: number;
  date: Date | string;
  created_at: Date | null;
  updated_at: Date | null;
  created_by: number;
  updated_by: number;
  deleted: boolean;
};

export type SellItem = {
  id: number;
  sell_id: number;
  item_id: number;
  item_name: string;
  created_by: number;
  updated_by: number;
  quantity: number;
  item_purchase_price: number;
  item_sell_price: number;
  created_at: Date | null;
  updated_at: Date | null;
  deleted: boolean;
  self_deleted: boolean;
};

export type Reservation = {
  id: number;
  customer_id: number;
  color_id: number;
  service_id: number;
  car_model_id: number;
  car_type_id: number;
  note: string | null;
  price: number;
  date_time: Date | string;
  created_at: Date | null;
  updated_at: Date | null;
  created_by: number;
  updated_by: number;
  deleted: boolean;
  completed: boolean;
};

export type Customer = {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  created_at: Date | null;
  updated_at: Date | null;
  created_by: number;
  updated_by: number;
  deleted: boolean;
};

export type Backup = {
  id: number;
  table: string;
  user_id: number;
  created_at: Date | null;
  updated_at: Date | null;
};

export type BackupWithUser = {
  id: number;
  table: string;
  user_id: number;
  user_name: string;
  user_role: string;
  created_at: Date | null;
  updated_at: Date | null;
};

export type ItemQuantityHistory = {
  id: number;
  created_by: number;
  item_id: number;
  quantity: number;
  item_purchase_price: number;
  item_sell_price: number;
  item_name: string;
  item_barcode: string;
  created_at: Date;
  updated_at: Date;
};

export type Config = {
  id: number;
  item_less_from: number;
  initial_money: number;

  created_at: Date | null;
  updated_at: Date | null;
};
