import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsDateString,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class UpdateExpenseDto {
  @IsNumber({}, { message: 'جۆری خەرجی دەبێت ژمارە بێت' })
  @IsPositive({ message: 'جۆری خەرجی دەبێت ژمارەیەکی ئەرێنی بێت' })
  @IsNotEmpty({ message: 'جۆری خەرجی پێویستە' })
  type_id: number;

  @IsNumber({}, { message: 'نرخ دەبێت ژمارە بێت' })
  @IsPositive({ message: 'نرخ دەبێت ژمارەیەکی ئەرێنی بێت' })
  @IsNotEmpty({ message: 'نرخ پێویستە' })
  price: number;

  @IsString({ message: 'بەروار دەبێت ڕشتەیەکی بەرواری دروست بێت' })
  @IsNotEmpty({ message: 'بەروار پێویستە' })
  date: string;

  @IsString({ message: 'تێبینی دەبێت ڕشتە بێت' })
  @IsNotEmpty({ message: 'تێبینی پێویستە' })
  note: string;

  @IsBoolean({ message: 'سڕاوەتەوە دەبێت بەڵێ/نەخێر بێت' })
  @IsOptional()
  deleted?: boolean;
}
