import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdateSellDto {
  @IsNumber({}, { message: 'داشکاندن دەبێت ژمارە بێت' })
  @IsPositive({ message: 'داشکاندن دەبێت ژمارەیەکی ئەرێنی بێت' })
  @IsNotEmpty({ message: 'داشکاندن پێویستە' })
  discount: number;
}
