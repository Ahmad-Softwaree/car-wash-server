import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RestoreSellDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Array of item IDs',
  })
  @IsArray({ message: 'ناسنامەکانی کاڵا دەبێت لیستێک بن' })
  @IsNumber({}, { each: true, message: 'هەر ناسنامەیەکی کاڵا دەبێت ژمارە بێت' })
  @IsOptional()
  item_ids: number[];
}
