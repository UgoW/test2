import { Module } from '@nestjs/common';
import { PlantAdvisorService } from './plant-advisor.service';
import { PlantAdvisorController } from './plant-advisor.controller';
import { User } from '../users/entities/user.entity';
import { Plant } from '../plants/entities/plant.entity';
import { PlantsModule } from '../plants/plants.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [PlantAdvisorController],
  providers: [PlantAdvisorService],
  imports: [TypeOrmModule.forFeature([User, Plant]), PlantsModule],
})
export class PlantAdvisorModule {}
