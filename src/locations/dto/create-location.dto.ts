import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({ example: 'Salon' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  name: string;
}