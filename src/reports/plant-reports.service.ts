import { Injectable } from '@nestjs/common';
import { Plant } from '../plants/entities/plant.entity';

@Injectable()
export class PlantReportsService {
  exportPlantsCsv(plants: Plant[]): string {
    const headers = [
      'id',
      'name',
      'status',
      'humidity',
      'light',
      'temperature',
      'location',
      'lastSync',
    ];

    const lines = plants.map((plant) => {
      const values = [
        plant.id,
        plant.name,
        plant.status,
        plant.humidity,
        plant.light,
        plant.temperature,
        plant.location,
        plant.lastSync.toISOString(),
      ];

      return values
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(',');
    });

    return [headers.join(','), ...lines].join('\n');
  }
}
