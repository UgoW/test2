import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plant } from './entities/plant.entity';
import { PlantHistory } from './entities/plant-history.entity';
import { Location } from '../locations/entities/location.entity';
import { PlantsController } from './plants.controller';
import { PlantsService } from './plants.service';
import { SyncModule } from '../sync/sync.module';
import { ReportsModule } from '../reports/reports.module';

@Module({
  imports: [TypeOrmModule.forFeature([Plant, PlantHistory, Location]), SyncModule, ReportsModule],
  controllers: [PlantsController],
  providers: [PlantsService],
  exports: [PlantsService],
})
export class PlantsModule {}
