import { Module } from '@nestjs/common';
import { PlantsModule } from '../plants/plants.module';
import { DashboardController } from './dashboard.controller';
import { DashboardMetricsService } from './dashboard-metrics.service';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [PlantsModule],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardMetricsService],
})
export class DashboardModule {}
