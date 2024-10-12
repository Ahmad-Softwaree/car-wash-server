import { IsBoolean, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddItemToSellDto {
  @ApiProperty({
    example: 1,
    description: 'The Id of the item',
  })
  @IsNumber({}, { message: 'ناسنامەی کاڵا دەبێت ژمارەی تەواو بێت' })
  @IsPositive({ message: 'ناسنامەی کاڵا دەبێت ژمارەیەکی ئەرێنی بێت' })
  @IsNotEmpty({ message: 'ناسنامەی کاڵا پێویستە' })
  item_id: number;

  @ApiProperty({
    example: true,
    description: 'Whether to use barcode or not',
  })
  @IsBoolean({ message: 'بارکۆد دەبێت بەڵێ یان نەخێر بێت' })
  barcode: boolean;
}
