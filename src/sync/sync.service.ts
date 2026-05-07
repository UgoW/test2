import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Plant } from '../plants/entities/plant.entity';

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(Plant)
    private readonly plantRepository: Repository<Plant>,
  ) {}

  async syncUserPlants(userId: string) {
    const now = new Date();

    const plants = await this.plantRepository.find({
      where: { user: { id: userId }, deletedAt: IsNull() },
    });

    if (plants.length === 0) {
      return {
        updatedCount: 0,
        lastSync: now,
      };
    }

    plants.forEach((plant) => {
      plant.lastSync = now;
    });

    await this.plantRepository.save(plants);

    return {
      updatedCount: plants.length,
      lastSync: now,
    };
  }
}
