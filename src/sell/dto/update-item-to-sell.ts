import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdateItemToSellDto {
  @IsNumber({}, { message: 'بڕی کاڵا دەبێت ژمارە بێت' })
  @IsPositive({ message: 'بڕی کاڵا دەبێت ژمارەیەکی ئەرێنی بێت' })
  @IsNotEmpty({ message: 'بڕی کاڵا پێویستە' })
  quantity: number;
}
