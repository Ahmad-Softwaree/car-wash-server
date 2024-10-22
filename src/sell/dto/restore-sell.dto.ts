import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class RestoreSellDto {
  @IsArray({ message: 'ناسنامەکانی کاڵا دەبێت لیستێک بن' })
  @IsNumber({}, { each: true, message: 'هەر ناسنامەیەکی کاڵا دەبێت ژمارە بێت' })
  @IsOptional()
  item_ids: number[];
}
