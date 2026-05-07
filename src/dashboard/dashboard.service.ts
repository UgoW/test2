import { Injectable } from '@nestjs/common';
import { PlantsService } from '../plants/plants.service';
import { DashboardMetricsService } from './dashboard-metrics.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly plantsService: PlantsService,
    private readonly dashboardMetricsService: DashboardMetricsService,
  ) {}

  async getOverview(userId: string) {
    const plants = await this.plantsService.findAllForUser(userId);

    return {
      kpis: this.dashboardMetricsService.buildKpis(plants),
      alerts: this.dashboardMetricsService.buildAlerts(plants),
      zones: this.dashboardMetricsService.buildZones(plants),
      lastSync: this.dashboardMetricsService.buildLastSync(plants),
      quickActions: [
        { id: 'add-plant', label: 'Add plant', enabled: true },
        { id: 'sync-now', label: 'Sync now', enabled: true },
        { id: 'export-report', label: 'Export report', enabled: true },
      ],
    };
  }
}
