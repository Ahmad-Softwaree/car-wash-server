import {
  ArrayNotEmpty,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Id } from 'src/types/global';

export default class CreateUserDto {
  @IsString({ message: 'ناوی بەکارهێنەر دەبێت ڕشتە بێت' })
  @IsNotEmpty({ message: 'ناوی بەکارهێنەر پێویستە' })
  @MinLength(3, { message: 'ناوی بەکارهێنەر دەبێت لانیکەم ٣ پیت بێت' })
  @MaxLength(30, { message: 'ناوی بەکارهێنەر دەبێت زۆر نەبێت لە ٣٠ پیت' })
  username: string;

  @IsString({ message: 'وشەی نهێنی دەبێت ڕشتە بێت' })
  @IsNotEmpty({ message: 'وشەی نهێنی پێویستە' })
  @MinLength(3, { message: 'وشەی نهێنی دەبێت لانیکەم ٣ پیت بێت' })
  @MaxLength(30, { message: 'وشەی نهێنی دەبێت زۆر نەبێت لە ٣٠ پیت' })
  password: string;

  @IsString({ message: 'ژمارە تەلەفۆن دەبێت ڕشتە بێت' })
  @IsNotEmpty({ message: 'ژمارە تەلەفۆن پێویستە' })
  @Matches(/^\d+$/, {
    message: 'ژمارە تەلەفۆن تەنها دەتوانێت ژمارە لەخۆ بگرێت',
  })
  phone: string;

  @IsString({ message: 'ناو دەبێت ڕشتە بێت' })
  @IsNotEmpty({ message: 'ناو پێویستە' })
  name: string;

  @IsNotEmpty({ message: 'ئایدی ڕۆڵ پێویستە' })
  @IsInt({ message: 'ئایدی ڕۆڵ دەبێت ژمارەیەکی تەواو بێت' })
  role_id: Id;

  @IsNotEmpty({ message: 'ئایدی بەشەکان پێویستن' })
  @ArrayNotEmpty({ message: 'لیستی بەشەکان نابێت بەتاڵ بێت' })
  @IsInt({ each: true, message: 'هەر ئایدی بەشێک دەبێت ژمارەیەکی تەواو بێت' })
  part_ids: Id[];

  @IsBoolean({ message: 'سڕینەوە دەبێت بەڵێ/نەخێر بێت' })
  @IsOptional()
  deleted?: boolean;
}
