import { IsBoolean, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddItemToSellDto {
  @ApiProperty({
    example: 'Item Id',
    description: 'The Id of the item',
  })
  @IsNumber({}, { message: 'Item Id must be a int' })
  @IsNotEmpty({ message: 'Item Id is required' })
  item_id: string;
  @IsBoolean()
  barcode: boolean;
}
