export type ENUM_TYPES =
  //GLOBAL
  | 'SEARCH_LIMIT'
  //PARTS
  | 'USERS_PART'
  | 'CUSTOMERS_PART'
  | 'EXPENSES_PART'
  | 'EXPENSE_TYPE_PART'
  | 'ROLES_PART'
  | 'COLORS_PART'
  | 'CAR_MODELS_PART'
  | 'CAR_TYPES_PART'
  | 'ITEM_TYPES_PART'
  | 'SERVICES_PART'
  | 'KOGA_PART'
  | 'CREATE_PSULA_PART'
  | 'SELL_PART'
  | 'NORMAL_BACKUP_PART'
  | 'SERVER_BACKUP_PART'
  | 'RESERVATION_PART'
  | 'DASHBOARD_PART'
  | 'RESERVATION_REPORT_PART'
  | 'SELL_REPORT_PART'
  | 'KOGA_REPORT_PART'
  | 'PROFIT_REPORT_PART'
  | 'CASE_REPORT_PART'
  | 'LESS_ITEM_PART'
  | 'EXPENSE_REPORT_PART'
  | 'CONFIG_PART'
  | 'COMPANY_INFO_PART';

export const ENUMs: { [key in ENUM_TYPES]: key | string | number } = {
  //GLOBAL
  SEARCH_LIMIT: 30,
  //PARTS
  USERS_PART: 'بەکارهێنەران',
  CUSTOMERS_PART: 'کڕیارەکان',
  EXPENSES_PART: 'خەرجی',
  EXPENSE_TYPE_PART: 'جۆرەکانی خەرجی',
  ROLES_PART: 'ڕۆڵەکان',
  COLORS_PART: 'ڕەنگەکان',
  CAR_MODELS_PART: 'مۆدێلەکانی ئۆتۆمبێل',
  CAR_TYPES_PART: 'جۆرەکانی ئۆتۆمبێل',
  SERVICES_PART: 'خزمەتگوزاریەکان',
  ITEM_TYPES_PART: 'جۆرەکانی بەرهەم',
  KOGA_PART: 'کۆگا',
  CREATE_PSULA_PART: 'پسولەی فرۆشتن',
  SELL_PART: 'پسولەکان',
  LESS_ITEM_PART: 'مەوادی کەمبوو',
  RESERVATION_PART: 'نۆرەکان',
  NORMAL_BACKUP_PART: 'باکئەپی ئاسایی',
  SERVER_BACKUP_PART: 'باکئەپی سێرڤەر',
  DASHBOARD_PART: 'داشبۆرد',
  SELL_REPORT_PART: 'ڕاپۆرتی فرۆشتن',
  CASE_REPORT_PART: 'ڕاپۆرتی صندوق',
  PROFIT_REPORT_PART: 'ڕاپۆرتی قازانج',
  RESERVATION_REPORT_PART: 'ڕاپۆرتی نۆرەکان',
  EXPENSE_REPORT_PART: 'ڕاپۆرتی خەرجی',
  KOGA_REPORT_PART: 'ڕاپۆرتی کۆگا',
  CONFIG_PART: 'ڕێکخستن',
  COMPANY_INFO_PART: 'زانیاری کۆمپانیا',
};
