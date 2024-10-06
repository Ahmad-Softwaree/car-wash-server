import {
  Backup,
  CarModel,
  CarType,
  Color,
  Customer,
  Expense,
  ExpenseType,
  Item,
  ItemQuantityHistory,
  ItemType,
  Reservation,
  Sell,
  SellItem,
  Service,
  User,
} from 'database/types';
import { UserWithRole, UserWithRoleAndPart } from './auth';
import { ExpenseWithType } from './expense';
import { RoleWithItsParts } from './role-part';
import { CaseReport } from './report';

export type Id = number;

export type Page = undefined | number;
export type Search = undefined | string;
export type Filter = undefined | string;
export type From = undefined | string;
export type Date = undefined | string;

export type To = undefined | string;

export type Limit = undefined | number;
export type Status = 400 | 401 | 402 | 403 | 404 | 500;
export type DataTypes =
  | UserWithRoleAndPart
  | UserWithRole[]
  | UserWithRoleAndPart[]
  | Expense[]
  | Customer[]
  | Item[]
  | ExpenseWithType[]
  | RoleWithItsParts[]
  | Color[]
  | CarModel[]
  | CarType[]
  | Service[]
  | ItemType[]
  | ExpenseType[]
  | Sell[]
  | SellItem[]
  | Reservation[]
  | Backup[]
  | ItemQuantityHistory[]
  | CaseReport[];

export type Tables =
  | User
  | Expense
  | Customer
  | Item
  | Color
  | CarModel
  | CarType
  | Service
  | ItemType
  | ExpenseType
  | Sell
  | SellItem
  | Reservation;

export type PaginationObject<T extends DataTypes> = {
  paginatedData: T;
  meta: {
    nextPageUrl: string;
    total: number;
  };
};

export type PaginationReturnType<T extends DataTypes> = PaginationObject<T>;
