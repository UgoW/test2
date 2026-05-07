import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { PaginationDto } from './pagination.dto';
import { PlantStatus } from '../entities/plant-status.enum';

export class ListPlantsQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: PlantStatus, example: PlantStatus.OK })
  @IsOptional()
  @IsEnum(PlantStatus)
  status?: PlantStatus;

  @ApiPropertyOptional({ example: 'Salon' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  @ApiPropertyOptional({ example: 'd5f4d4ff-6d63-4fd8-8f2f-fcbad3ecf2c1' })
  @IsOptional()
  @IsUUID()
  locationId?: string;

  @ApiPropertyOptional({ example: 'ficus', description: 'Search in name and location' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;
}
