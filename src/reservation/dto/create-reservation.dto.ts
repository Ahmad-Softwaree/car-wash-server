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
  @IsNotEmpty({ message: 'ID-ی کڕیار پێویستە' })
  @IsInt({ message: 'ID-ی کڕیار دەبێت ژمارەیەکی تەواو بێت' })
  customer_id: Id;

  @IsNotEmpty({ message: 'ID-ی ڕەنگ پێویستە' })
  @IsInt({ message: 'ID-ی ڕەنگ دەبێت ژمارەیەکی تەواو بێت' })
  @IsOptional()
  color_id: Id;

  @IsNotEmpty({ message: 'ID-ی خزمەتگوزاری پێویستە' })
  @IsInt({ message: 'ID-ی خزمەتگوزاری دەبێت ژمارەیەکی تەواو بێت' })
  service_id: Id;

  @IsNotEmpty({ message: 'ID-ی مۆدیلی ئۆتۆمۆبێل پێویستە' })
  @IsInt({ message: 'ID-ی مۆدیلی ئۆتۆمۆبێل دەبێت ژمارەیەکی تەواو بێت' })
  @IsOptional()
  car_model_id: Id;

  @IsNotEmpty({ message: 'ID-ی جۆری ئۆتۆمۆبێل پێویستە' })
  @IsInt({ message: 'ID-ی جۆری ئۆتۆمۆبێل دەبێت ژمارەیەکی تەواو بێت' })
  @IsOptional()
  car_type_id: Id;

  @IsOptional()
  @IsString({ message: 'تێبینی دەبێت ڕشتە بێت' })
  note?: string;

  @IsNotEmpty({ message: 'نرخی پەیام پێویستە' })
  @IsInt({ message: 'نرخی پەیام دەبێت ژمارەیەکی تەواو بێت' })
  price: number;

  @IsNotEmpty({ message: 'نرخی پەیام پێویستە' })
  @IsString({ message: 'نرخی پەیام دەبێت تەواو بێت' })
  car_number: string;

  @IsNotEmpty({ message: 'کات و بەروار پێویستە' })
  @IsString({ message: 'کاتە و ڕووی پەیام دەبێت لە شێوەی ڕووی بەیانی بێت' })
  date_time: string;

  @IsBoolean({ message: 'سڕینەوە دەبێت بەڵێ/نەخێر بێت' })
  @IsOptional()
  deleted?: boolean;
}
