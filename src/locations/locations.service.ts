import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreateLocationDto } from './dto/create-location.dto';
import { Location } from './entities/location.entity';
import { Plant } from '../plants/entities/plant.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(Plant)
    private readonly plantRepository: Repository<Plant>,
  ) {}

  async create(userId: string, createLocationDto: CreateLocationDto) {
    const name = createLocationDto.name.trim();

    const existingLocation = await this.locationRepository.findOne({
      where: {
        user: { id: userId },
        name,
      },
    });

    if (existingLocation) {
      return existingLocation;
    }

    const location = this.locationRepository.create({
      name,
      user: { id: userId } as User,
    });

    return this.locationRepository.save(location);
  }

  async findAll(userId: string) {
    return this.locationRepository.find({
      where: { user: { id: userId } },
      order: { name: 'ASC' },
    });
  }

  async findPlants(userId: string, locationId: string) {
    const location = await this.locationRepository.findOne({
      where: { id: locationId, user: { id: userId } },
    });

    if (!location) {
      throw new NotFoundException('Location not found');
    }

    return this.plantRepository.find({
      where: {
        user: { id: userId },
        location: { id: locationId },
        deletedAt: IsNull(),
      },
      relations: ['history', 'location'],
      order: { updatedAt: 'DESC' },
    });
  }
}