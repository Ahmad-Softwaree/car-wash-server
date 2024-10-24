import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  Matches,
} from 'class-validator';

export default class UpdateCustomerDto {
  @IsString({ message: 'ناو دەبێت ڕشتە بێت' })
  @IsNotEmpty({ message: 'ناو پێویستە' })
  name: string;

  @IsString({ message: 'ژمارە تەلەفۆن دەبێت ڕشتە بێت' })
  @IsNotEmpty({ message: 'ژمارە تەلەفۆن پێویستە' })
  phone: string;

  @IsBoolean({ message: 'سڕینەوە دەبێت بەڵێ/نەخێر بێت' })
  @IsOptional()
  deleted?: boolean;
}
