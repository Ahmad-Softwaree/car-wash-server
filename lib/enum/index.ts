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
  | 'SELL_REPORT_PART'
  | 'KOGA_REPORT_PART'
  | 'PROFIT_REPORT_PART'
  | 'CASE_REPORT_PART';

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
  RESERVATION_PART: 'نۆرەکان',
  NORMAL_BACKUP_PART: 'باکئەپی ئاسایی',
  SERVER_BACKUP_PART: 'باکئەپی سێرڤەر',
  DASHBOARD_PART: 'داشبۆرد',
  SELL_REPORT_PART: 'ڕاپۆرتی فرۆشتن',
  CASE_REPORT_PART: 'ڕاپۆرتی قاسە',
  PROFIT_REPORT_PART: 'ڕاپۆرتی قازانج',
  KOGA_REPORT_PART: 'ڕاپۆرتی کۆگا',
};
