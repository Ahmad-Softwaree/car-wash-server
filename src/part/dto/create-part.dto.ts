import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePartDto {
  @IsString({ message: 'ناو دەبێت نووسین بێت' })
  @IsNotEmpty({ message: 'ناو پێویستە' })
  name: string;
}
