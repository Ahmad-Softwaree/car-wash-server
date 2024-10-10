import { Reservation } from 'database/types';

export type ExpenseCounts = {
  total_expense: number | null;
  count_expense: string | number;
};

export type Dashboard = {
  count_expense: number | string;
  total_expense: number | string;
  users: string;
  item: string;
  sell: string;
  item_quantity_history: string;
  backup: string;
  reservations: Pick<
    Reservation,
    'price' | 'id' | 'customer_id' | 'date_time'
  >[];
  total_reservation_price: number;
};
