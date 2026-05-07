import { Injectable } from '@nestjs/common';
import { Plant } from '../plants/entities/plant.entity';
import { PlantStatus } from '../plants/entities/plant-status.enum';

type AlertReason = 'humidite_basse' | 'humidite_critique' | 'lumiere_insuffisante' | 'lumiere_critique';
type SyncStatus = 'ok' | 'warning' | 'critical';

@Injectable()
export class DashboardMetricsService {
  buildKpis(plants: Plant[]) {
    const totalPlants = plants.length;
    const okPlants = plants.filter((plant) => plant.status === PlantStatus.OK).length;
    const attentionPlants = plants.filter((plant) => plant.status === PlantStatus.ATTENTION).length;
    const criticalPlants = plants.filter((plant) => plant.status === PlantStatus.CRITICAL).length;

    const avgHealthPercent =
      totalPlants === 0
        ? 0
        : Math.round((okPlants * 100 + attentionPlants * 50 + criticalPlants * 0) / totalPlants);

    return {
      totalPlants,
      okPlants,
      attentionPlants,
      criticalPlants,
      avgHealthPercent,
    };
  }

  buildAlerts(plants: Plant[]) {
    return plants
      .filter((plant) => plant.status !== PlantStatus.OK)
      .map((plant) => ({
        plantId: plant.id,
        plantName: plant.name,
        status: plant.status,
        location: plant.location?.name ?? '',
        reasons: this.getAlertReasons(plant),
        lastSync: plant.lastSync,
      }));
  }

  buildZones(plants: Plant[]) {
    const grouped = plants.reduce<Map<string, Plant[]>>((acc, plant) => {
      const key = plant.location?.name ?? 'Sans localisation';
      const existing = acc.get(key) ?? [];
      existing.push(plant);
      acc.set(key, existing);
      return acc;
    }, new Map());

    return Array.from(grouped.entries()).map(([zoneName, zonePlants]) => {
      const total = zonePlants.length;
      const okCount = zonePlants.filter((plant) => plant.status === PlantStatus.OK).length;
      const attentionCount = zonePlants.filter((plant) => plant.status === PlantStatus.ATTENTION).length;
      const criticalCount = zonePlants.filter((plant) => plant.status === PlantStatus.CRITICAL).length;

      let globalStatus: PlantStatus = PlantStatus.OK;
      if (criticalCount > 0) {
        globalStatus = PlantStatus.CRITICAL;
      } else if (attentionCount > 0) {
        globalStatus = PlantStatus.ATTENTION;
      }

      return {
        zoneName,
        total,
        okCount,
        attentionCount,
        criticalCount,
        globalStatus,
      };
    });
  }

  buildLastSync(plants: Plant[], now: Date = new Date()) {
    if (plants.length === 0) {
      return {
        lastSyncGlobal: null,
        statusSync: 'critical' as SyncStatus,
        minutesElapsed: null,
      };
    }

    const lastSyncGlobal = plants.reduce((latest, plant) =>
      plant.lastSync > latest ? plant.lastSync : latest,
    plants[0].lastSync);

    const minutesElapsed = Math.floor((now.getTime() - lastSyncGlobal.getTime()) / 60000);

    let statusSync: SyncStatus = 'critical';
    if (minutesElapsed <= 10) {
      statusSync = 'ok';
    } else if (minutesElapsed <= 30) {
      statusSync = 'warning';
    }

    return {
      lastSyncGlobal,
      statusSync,
      minutesElapsed,
    };
  }

  private getAlertReasons(plant: Plant): AlertReason[] {
    const reasons: AlertReason[] = [];

    if (plant.status === PlantStatus.ATTENTION) {
      if (plant.humidity < 40) {
        reasons.push('humidite_basse');
      }
      if (plant.light < 300) {
        reasons.push('lumiere_insuffisante');
      }
    }

    if (plant.status === PlantStatus.CRITICAL) {
      if (plant.humidity < 35) {
        reasons.push('humidite_critique');
      }
      if (plant.light < 250) {
        reasons.push('lumiere_critique');
      }
    }

    return reasons;
  }
}
