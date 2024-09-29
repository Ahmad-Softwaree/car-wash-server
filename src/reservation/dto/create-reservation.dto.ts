import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import { Id } from 'src/types/global';

export default class CreateReservationDto {
  @ApiProperty({ example: 1, description: 'The ID of the customer' })
  @IsNotEmpty({ message: 'ID-ی کڕیار پێویستە' })
  @IsInt({ message: 'ID-ی کڕیار دەبێت ژمارەیەکی تەواو بێت' })
  customer_id: Id;

  @ApiProperty({ example: 1, description: 'The ID of the color' })
  @IsNotEmpty({ message: 'ID-ی ڕەنگ پێویستە' })
  @IsInt({ message: 'ID-ی ڕەنگ دەبێت ژمارەیەکی تەواو بێت' })
  color_id: Id;

  @ApiProperty({ example: 1, description: 'The ID of the service' })
  @IsNotEmpty({ message: 'ID-ی خزمەتگوزاری پێویستە' })
  @IsInt({ message: 'ID-ی خزمەتگوزاری دەبێت ژمارەیەکی تەواو بێت' })
  service_id: Id;

  @ApiProperty({ example: 1, description: 'The ID of the car model' })
  @IsNotEmpty({ message: 'ID-ی مۆدیلی ئۆتۆمۆبێل پێویستە' })
  @IsInt({ message: 'ID-ی مۆدیلی ئۆتۆمۆبێل دەبێت ژمارەیەکی تەواو بێت' })
  car_model_id: Id;

  @ApiProperty({ example: 1, description: 'The ID of the car type' })
  @IsNotEmpty({ message: 'ID-ی جۆری ئۆتۆمۆبێل پێویستە' })
  @IsInt({ message: 'ID-ی جۆری ئۆتۆمۆبێل دەبێت ژمارەیەکی تەواو بێت' })
  car_type_id: Id;

  @ApiProperty({
    example: 'Optional note about the reservation',
    description: 'An optional note about the reservation',
  })
  @IsOptional()
  @IsString({ message: 'تێبینی دەبێت ڕشتە بێت' })
  note?: string;

  @ApiProperty({ example: 100, description: 'The price of the reservation' })
  @IsNotEmpty({ message: 'نرخی پەیام پێویستە' })
  @IsInt({ message: 'نرخی پەیام دەبێت ژمارەیەکی تەواو بێت' })
  price: number;

  @ApiProperty({
    example: '2024-09-25T15:00:00Z',
    description: 'The date and time of the reservation',
  })
  @IsNotEmpty({ message: 'کات و بەروار پێویستە' })
  @IsString({ message: 'کاتە و ڕووی پەیام دەبێت لە شێوەی ڕووی بەیانی بێت' })
  date_time: string;

  @ApiProperty({
    example: false,
    description: 'Indicates whether the reservation is deleted or not',
  })
  @IsBoolean({ message: 'سڕینەوە دەبێت بەڵێ/نەخێر بێت' })
  @IsOptional()
  deleted?: boolean;
}
