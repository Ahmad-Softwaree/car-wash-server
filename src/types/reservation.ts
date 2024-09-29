import { Reservation } from 'database/types';
import { Id } from './global';

export type PanelReservation = {
  date: Date | string;
  customer_name: string;
  id: Id;
};

export type ReservationWithCustomer = Pick<
  Reservation,
  'id' | 'customer_id' | 'date_time'
> & {
  customer_name: string;
};
