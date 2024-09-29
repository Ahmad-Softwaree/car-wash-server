import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSellDto {
  @ApiProperty({
    example: 100,
    description: 'The discount of the sell',
  })
  @IsNumber({}, { message: ' discount must be a number' })
  @IsPositive({ message: ' discount must be positive' })
  @IsNotEmpty({ message: ' discount is required' })
  discount: number;
}
