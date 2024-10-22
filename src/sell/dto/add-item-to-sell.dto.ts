import { IsBoolean, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class AddItemToSellDto {
  @IsNumber({}, { message: 'ناسنامەی کاڵا دەبێت ژمارەی تەواو بێت' })
  @IsPositive({ message: 'ناسنامەی کاڵا دەبێت ژمارەیەکی ئەرێنی بێت' })
  @IsNotEmpty({ message: 'ناسنامەی کاڵا پێویستە' })
  item_id: number;

  @IsBoolean({ message: 'بارکۆد دەبێت بەڵێ یان نەخێر بێت' })
  barcode: boolean;
}
