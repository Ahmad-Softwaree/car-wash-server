import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSellDto {
  @ApiProperty({
    example: 100,
    description: 'The discount of the sell',
  })
  @IsNumber({}, { message: 'داشکاندن دەبێت ژمارە بێت' })
  @IsPositive({ message: 'داشکاندن دەبێت ژمارەیەکی ئەرێنی بێت' })
  @IsNotEmpty({ message: 'داشکاندن پێویستە' })
  discount: number;
}
