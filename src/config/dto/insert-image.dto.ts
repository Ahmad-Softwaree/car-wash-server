import { IsString, IsOptional, IsUrl } from 'class-validator';

export class InsetCompanyImageDto {
  @IsString({ message: 'ناوی وێنە دەبێت نووسراو بێت' })
  @IsOptional()
  image_name: string;

  @IsUrl({}, { message: 'بەستەری وێنە دەبێت بەستەرێکی دروست بێت' })
  @IsOptional()
  image_url: string;
}
