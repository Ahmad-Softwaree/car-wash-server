import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export default class CreateReservationMobileDto {
  @IsNotEmpty({ message: 'نرخی پەیام پێویستە' })
  @IsInt({ message: 'نرخی پەیام دەبێت ژمارەیەکی تەواو بێت' })
  price: number;

  @IsNotEmpty({ message: 'نرخی پەیام پێویستە' })
  @IsString({ message: 'نرخی پەیام دەبێت تەواو بێت' })
  @IsOptional()
  car_number: string;

  @IsBoolean({ message: 'سڕینەوە دەبێت بەڵێ/نەخێر بێت' })
  @IsOptional()
  deleted?: boolean;
}
