import { IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class ChangeItemQuantityDto {
  @IsNumber({}, { message: 'بڕ دەبێت ژمارە بێت' })
  @IsPositive({ message: 'بڕ دەبێت ژمارەیەکی ئەرێنی بێت' })
  @IsNotEmpty({ message: 'بڕ پێویستە' })
  @IsOptional()
  quantity: number;
}
