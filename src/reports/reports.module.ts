import { Module } from '@nestjs/common';
import { PlantReportsService } from './plant-reports.service';

@Module({
  providers: [PlantReportsService],
  exports: [PlantReportsService],
})
export class ReportsModule {}
