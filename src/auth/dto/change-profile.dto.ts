import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export default class ChangeProfileDto {
  @IsString({ message: 'ناو دەبێت ڕشتە بێت' })
  @IsNotEmpty({ message: 'ناو پێویستە' })
  @MinLength(2, { message: 'ناو دەبێت لانیکەم ٢ پیت بێت' })
  @MaxLength(50, { message: 'ناو دەبێت زۆر نەبێت لە ٥٠ پیت' })
  name: string;
}
