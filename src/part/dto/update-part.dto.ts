import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePartDto {
  @IsString({ message: 'ناو دەبێت نووسین بێت' })
  @IsNotEmpty({ message: 'ناو پێویستە' })
  name: string;
}
