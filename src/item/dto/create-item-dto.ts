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
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({
    example: 'Example Item',
    description: 'The name of the item',
  })
  @IsString({ message: 'ناو دەبێت ڕیزبەند بێت' })
  @IsNotEmpty({ message: 'ناو پێویستە' })
  name: string;

  @ApiProperty({
    example: '1234567890123',
    description: 'The barcode of the item',
  })
  @IsString({ message: 'بارکۆد دەبێت ڕیزبەند بێت' })
  @IsOptional()
  barcode?: string;

  @ApiProperty({
    example: 'Item type',
    description: 'The type of the item',
  })
  @IsInt({ message: 'جۆر دەبێت ژمارەی تەواو بێت' })
  @IsNotEmpty({ message: 'جۆر پێویستە' })
  type_id: number;

  @ApiProperty({
    example: 'example-image.jpg',
    description: 'The name of the item image',
    required: false,
  })
  @IsString({ message: 'ناوی وێنە دەبێت ڕیزبەند بێت' })
  @IsOptional()
  image_name?: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'The URL of the item image',
    required: false,
  })
  @IsString({ message: 'بەستەری وێنە دەبێت بەستەرێکی دروست بێت' })
  @IsOptional()
  image_url?: string;

  @ApiProperty({
    example: 100,
    description: 'The quantity of the item in stock',
  })
  @IsNumber({}, { message: 'بڕ دەبێت ژمارە بێت' })
  @Min(0, { message: 'بڕ دەبێت ٠ یان زیاتر بێت' }) // Allow zero or positive numbers
  @IsOptional()
  quantity?: number;

  @ApiProperty({
    example: 50,
    description: 'The purchase price of the item',
  })
  @IsNumber({}, { message: 'نرخی کڕین دەبێت ژمارە بێت' })
  @IsPositive({ message: 'نرخی کڕین دەبێت ئەرێنی بێت' })
  @IsNotEmpty({ message: 'نرخی کڕین پێویستە' })
  item_purchase_price: number;

  @ApiProperty({
    example: 50,
    description: 'The purchase price of the item',
  })
  @IsNumber({}, { message: 'کەمترین عددی مەواد دەبێت ژمارە بێت' })
  @IsPositive({ message: 'کەمترین عددی مەواد دەبێت ئەرێنی بێت' })
  @IsNotEmpty({ message: 'کەمترین عددی مەواد پێویستە' })
  item_less_from: number;

  @ApiProperty({
    example: 100,
    description: 'The selling price of the item',
  })
  @IsNumber({}, { message: 'نرخی فرۆشتن دەبێت ژمارە بێت' })
  @IsPositive({ message: 'نرخی فرۆشتن دەبێت ئەرێنی بێت' })
  @IsNotEmpty({ message: 'نرخی فرۆشتن پێویستە' })
  item_sell_price: number;

  @ApiProperty({
    example: 'This is a note about the item.',
    description: 'Additional notes about the item',
    required: false,
  })
  @IsString({ message: 'تێبینی دەبێت ڕیزبەند بێت' })
  @IsOptional()
  note?: string;

  @ApiProperty({
    example: false,
    description: 'Whether the item is deleted',
    required: false,
  })
  @IsBoolean({ message: 'سڕاوەتەوە دەبێت بوڵی بێت' })
  @IsOptional()
  deleted?: boolean;
}
