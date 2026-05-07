import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plant } from '../plants/entities/plant.entity';
import { SyncService } from './sync.service';

@Module({
  imports: [TypeOrmModule.forFeature([Plant])],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}
