import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Plant } from './plant.entity';

@Entity('plant_history')
export class PlantHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'datetime' })
  timestamp: Date;

  @Column('float')
  humidity: number;

  @Column('float')
  light: number;

  @ManyToOne(() => Plant, (plant) => plant.history, { onDelete: 'CASCADE' })
  plant: Plant;
}
