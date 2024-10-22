import { IsNotEmpty } from 'class-validator';

export class UpdateConfigDto {
  @IsNotEmpty({ message: 'Value is required' })
  value: any;
}
