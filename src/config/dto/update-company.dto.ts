import { IsString, IsBoolean, IsOptional, IsUrl } from 'class-validator';

export class CompanyDto {
  @IsString({ message: 'ژمارەی تەلەفۆن دەبێت نووسراو بێت' })
  @IsOptional()
  phone: string;

  @IsString({ message: 'ژمارەی تەلەفۆنی دووەم دەبێت نووسراو بێت' })
  @IsOptional()
  phone1: string;

  @IsString({ message: 'ناو دەبێت نووسراو بێت' })
  @IsOptional()
  name: string;

  @IsString({ message: 'وەسف دەبێت نووسراو بێت' })
  @IsOptional()
  description: string;

  @IsString({ message: 'شوێن دەبێت نووسراو بێت' })
  @IsOptional()
  location: string;

  @IsBoolean({ message: 'سڕاوەتەوە دەبێت بەڵێ/نەخێر بێت' })
  @IsOptional()
  deleted: boolean;
}
