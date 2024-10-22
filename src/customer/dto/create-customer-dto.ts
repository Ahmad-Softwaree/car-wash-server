import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export default class CreateCustomerDto {
  @IsString({ message: 'ناوی یەکەم دەبێت ڕشتە بێت' })
  @IsNotEmpty({ message: 'ناوی یەکەم پێویستە' })
  first_name: string;

  @IsString({ message: 'ناوی دووەم دەبێت ڕشتە بێت' })
  @IsNotEmpty({ message: 'ناوی دووەم پێویستە' })
  last_name: string;

  @IsString({ message: 'ژمارە تەلەفۆن دەبێت ڕشتە بێت' })
  @IsNotEmpty({ message: 'ژمارە تەلەفۆن پێویستە' })
  phone: string;

  @IsBoolean({ message: 'سڕینەوە دەبێت بەڵێ/نەخێر بێت' })
  @IsOptional()
  deleted?: boolean;
}
