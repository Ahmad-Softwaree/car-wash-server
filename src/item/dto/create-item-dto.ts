import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateItemDto {
  @IsString({ message: 'ناو دەبێت ڕیزبەند بێت' })
  @IsNotEmpty({ message: 'ناو پێویستە' })
  name: string;

  @IsString({ message: 'بارکۆد دەبێت ڕیزبەند بێت' })
  @IsOptional()
  barcode?: string;

  @IsInt({ message: 'جۆر دەبێت ژمارەی تەواو بێت' })
  @IsNotEmpty({ message: 'جۆر پێویستە' })
  type_id: number;

  @IsString({ message: 'ناوی وێنە دەبێت ڕیزبەند بێت' })
  @IsOptional()
  image_name?: string;

  @IsString({ message: 'بەستەری وێنە دەبێت بەستەرێکی دروست بێت' })
  @IsOptional()
  image_url?: string;

  @IsNumber({}, { message: 'بڕ دەبێت ژمارە بێت' })
  @Min(0, { message: 'بڕ دەبێت ٠ یان زیاتر بێت' }) // Allow zero or positive numbers
  @IsOptional()
  quantity?: number;

  @IsNumber({}, { message: 'نرخی کڕین دەبێت ژمارە بێت' })
  @IsPositive({ message: 'نرخی کڕین دەبێت ئەرێنی بێت' })
  @IsNotEmpty({ message: 'نرخی کڕین پێویستە' })
  item_purchase_price: number;

  @IsNumber({}, { message: 'کەمترین عددی مەواد دەبێت ژمارە بێت' })
  @IsPositive({ message: 'کەمترین عددی مەواد دەبێت ئەرێنی بێت' })
  @IsNotEmpty({ message: 'کەمترین عددی مەواد پێویستە' })
  item_less_from: number;

  @IsNumber({}, { message: 'نرخی فرۆشتن دەبێت ژمارە بێت' })
  @IsPositive({ message: 'نرخی فرۆشتن دەبێت ئەرێنی بێت' })
  @IsNotEmpty({ message: 'نرخی فرۆشتن پێویستە' })
  item_sell_price: number;

  @IsString({ message: 'تێبینی دەبێت ڕیزبەند بێت' })
  @IsOptional()
  note?: string;

  @IsBoolean({ message: 'سڕاوەتەوە دەبێت بوڵی بێت' })
  @IsOptional()
  deleted?: boolean;
}
