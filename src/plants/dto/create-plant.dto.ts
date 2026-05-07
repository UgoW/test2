import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { PlantStatus } from '../entities/plant-status.enum';

export class CreatePlantDto {
  @ApiProperty({ example: 'Mon plant' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: PlantStatus.OK, enum: PlantStatus })
  @IsEnum(PlantStatus)
  status: PlantStatus;

  @ApiProperty({ example: 45 })
  @IsNumber()
  @Min(0)
  humidity: number;

  @ApiProperty({ example: 300 })
  @IsNumber()
  @Min(0)
  light: number;

  @ApiProperty({ example: 22.5 })
  @IsNumber()
  temperature: number;

  @ApiProperty({ example: 'Salon' })
  @IsString()
  @IsNotEmpty()
  location: string;
}
