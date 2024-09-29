import { Item } from 'database/types';

export type ItemWithType = {
  id: number;
  name: string;
  barcode: string;
  type_id: number;
  type_name: string;
  quantity: number;
  actual_quantity: number;
  item_purchase_price: number;
  created_by: string;
  updated_by: string;
  item_sell_price: number;
  image_name: string;
  image_url: string;
  note: string;
  created_at: Date | null;
  updated_at: Date | null;

  deleted: boolean;
};
