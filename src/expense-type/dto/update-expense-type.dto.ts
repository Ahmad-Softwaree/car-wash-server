import { IsNotEmpty, IsString } from 'class-validator';

export default class UpdateExpenseTypeDto {
  @IsString({ message: 'ناو  دەبێت ڕشتە بێت' })
  @IsNotEmpty({ message: ' ناو پێویستە' })
  name: string;
}
