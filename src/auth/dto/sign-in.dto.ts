import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export default class SignInDto {
  @ApiProperty({ example: 'JohnDoe', description: 'The username of the user' })
  @IsString({ message: 'ناوی بەکارهێنەر دەبێت نووسین بێت' })
  @IsNotEmpty({ message: 'ناوی بەکارهێنەر پێویستە' })
  @MinLength(3, { message: 'ناوی بەکارهێنەر دەبێت لانیکەم ٣ پیت بێت' })
  @MaxLength(30, { message: 'ناوی بەکارهێنەر دەبێت زۆر نەبێت لە ٣٠ پیت' })
  username: string;

  @ApiProperty({ example: 'ahmad123', description: 'The password of the user' })
  @IsString({ message: 'وشەی نهێنی دەبێت نووسین بێت' })
  @IsNotEmpty({ message: 'وشەی نهێنی پێویستە' })
  @MinLength(3, { message: 'وشەی نهێنی دەبێت لانیکەم ٣ پیت بێت' })
  @MaxLength(30, { message: 'وشەی نهێنی دەبێت زۆر نەبێت لە ٣٠ پیت' })
  password: string;
}
