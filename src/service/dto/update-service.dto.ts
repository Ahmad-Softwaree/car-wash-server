import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export default class UpdateServiceDto {
  @IsString({ message: 'ناو  دەبێت ڕشتە بێت' })
  @IsNotEmpty({ message: ' ناو پێویستە' })
  name: string;

  @IsNotEmpty({ message: 'نرخی پەیام پێویستە' })
  @IsInt({ message: 'نرخی پەیام دەبێت ژمارەیەکی تەواو بێت' })
  price: number;
}
