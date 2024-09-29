import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsDateString,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the expense type',
  })
  @IsNumber({}, { message: 'جۆری خەرجی دەبێت ژمارە بێت' })
  @IsPositive({ message: 'جۆری خەرجی دەبێت ژمارەیەکی ئەرێنی بێت' })
  @IsNotEmpty({ message: 'جۆری خەرجی پێویستە' })
  type_id: number;

  @ApiProperty({
    example: 100,
    description: 'The price of the expense',
  })
  @IsNumber({}, { message: 'نرخ دەبێت ژمارە بێت' })
  @IsPositive({ message: 'نرخ دەبێت ژمارەیەکی ئەرێنی بێت' })
  @IsNotEmpty({ message: 'نرخ پێویستە' })
  price: number;

  @ApiProperty({
    example: '2023-09-14T12:00:00Z',
    description: 'The date and time of the expense',
  })
  @IsString({ message: 'بەروار دەبێت ڕشتەیەکی بەرواری دروست بێت' })
  @IsNotEmpty({ message: 'بەروار پێویستە' })
  date: string;

  @ApiProperty({
    example: 'Office supplies purchase',
    description: 'Additional notes about the expense',
  })
  @IsString({ message: 'تێبینی دەبێت ڕشتە بێت' })
  @IsNotEmpty({ message: 'تێبینی پێویستە' })
  note: string;

  @ApiProperty({
    example: false,
    description: 'Indicates whether the expense is deleted',
    required: false,
  })
  @IsBoolean({ message: 'سڕاوەتەوە دەبێت بەڵێ/نەخێر بێت' })
  @IsOptional()
  deleted?: boolean;
}
