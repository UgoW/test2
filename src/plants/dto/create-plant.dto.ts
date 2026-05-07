import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';
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

  @ApiProperty({ example: 'd5f4d4ff-6d63-4fd8-8f2f-fcbad3ecf2c1' })
  @IsUUID()
  @IsNotEmpty()
  locationId: string;
}
