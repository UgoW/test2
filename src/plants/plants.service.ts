import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreatePlantDto } from './dto/create-plant.dto';
import { ListPlantsQueryDto } from './dto/list-plants-query.dto';
import { Plant } from './entities/plant.entity';
import { User } from '../users/entities/user.entity';
import { SyncService } from '../sync/sync.service';
import { PlantReportsService } from '../reports/plant-reports.service';

@Injectable()
export class PlantsService {
  constructor(
    @InjectRepository(Plant)
    private readonly plantRepository: Repository<Plant>,
    private readonly syncService: SyncService,
    private readonly reportsService: PlantReportsService,
  ) {}

  async create(userId: string, createPlantDto: CreatePlantDto) {
    const plant = this.plantRepository.create({
      ...createPlantDto,
      lastSync: new Date(),
      user: { id: userId } as User,
      history: [],
    });

    return this.plantRepository.save(plant);
  }

  async findAll(userId: string, filters: ListPlantsQueryDto) {
    const page = filters.page ?? 1;
    const limit = Math.min(filters.limit ?? 20, 100);

    const qb = this.baseUserPlantsQuery(userId).orderBy('plant.updatedAt', 'DESC');

    if (filters.status) {
      qb.andWhere('plant.status = :status', { status: filters.status });
    }

    if (filters.location) {
      qb.andWhere('LOWER(plant.location) = LOWER(:location)', {
        location: filters.location,
      });
    }

    if (filters.search) {
      qb.andWhere(
        '(LOWER(plant.name) LIKE LOWER(:search) OR LOWER(plant.location) LIKE LOWER(:search))',
        { search: `%${filters.search}%` },
      );
    }

    qb.skip((page - 1) * limit).take(limit);

    const [plants, total] = await qb.getManyAndCount();

    return {
      data: plants,
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
        timestamp: new Date().toISOString(),
      },
    };
  }

  async findAllForUser(userId: string) {
    return this.baseUserPlantsQuery(userId)
      .orderBy('plant.updatedAt', 'DESC')
      .getMany();
  }

  async findOne(userId: string, id: string) {
    const plant = await this.plantRepository.findOne({
      where: { id, user: { id: userId }, deletedAt: IsNull() },
      relations: ['history'],
    });

    if (!plant) {
      throw new NotFoundException('Plant not found');
    }

    return plant;
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.plantRepository.softDelete({ id, user: { id: userId } as User });
    return { deleted: true, id };
  }

  async syncNow(userId: string) {
    return this.syncService.syncUserPlants(userId);
  }

  async exportCsv(userId: string) {
    const plants = await this.findAllForUser(userId);
    const content = this.reportsService.exportPlantsCsv(plants);
    const filename = `plants-report-${new Date().toISOString()}.csv`;

    return {
      format: 'csv',
      filename,
      content,
      total: plants.length,
    };
  }

  private baseUserPlantsQuery(userId: string) {
    return this.plantRepository
      .createQueryBuilder('plant')
      .leftJoinAndSelect('plant.history', 'history')
      .leftJoin('plant.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('plant.deletedAt IS NULL');
  }
}
