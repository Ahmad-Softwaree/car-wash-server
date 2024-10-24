import { IsNotEmpty } from 'class-validator';

export class UpdateConfigDto {
  @IsNotEmpty({ message: 'داتا پیویستە' })
  value: any;
}
