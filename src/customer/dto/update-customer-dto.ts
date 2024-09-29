import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  Matches,
} from 'class-validator';

export default class UpdateCustomerDto {
  @ApiProperty({
    example: 'John',
    description: 'The first name of the employee',
  })
  @IsString({ message: 'ناوی یەکەم دەبێت ڕشتە بێت' })
  @IsNotEmpty({ message: 'ناوی یەکەم پێویستە' })
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'ناو تەنها دەتوانێت پیت و بۆشایی لەخۆ بگرێت',
  })
  first_name: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the employee',
  })
  @IsString({ message: 'ناوی دووەم دەبێت ڕشتە بێت' })
  @IsNotEmpty({ message: 'ناوی دووەم پێویستە' })
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'ناو تەنها دەتوانێت پیت و بۆشایی لەخۆ بگرێت',
  })
  last_name: string;

  @ApiProperty({
    example: '1234567890',
    description: 'The phone number of the user',
  })
  @IsString({ message: 'ژمارە تەلەفۆن دەبێت ڕشتە بێت' })
  @IsNotEmpty({ message: 'ژمارە تەلەفۆن پێویستە' })
  @Matches(/^\d+$/, {
    message: 'ژمارە تەلەفۆن تەنها دەتوانێت ژمارە لەخۆ بگرێت',
  })
  phone: string;

  @ApiProperty({
    example: false,
    description: 'Indicates whether the employee is deleted or not',
  })
  @IsBoolean({ message: 'سڕینەوە دەبێت بەڵێ/نەخێر بێت' })
  @IsOptional()
  deleted?: boolean;
}
