import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlantHistory } from './plant-history.entity';
import { User } from '../../users/entities/user.entity';
import { PlantStatus } from './plant-status.enum';

@Entity('plants')
export class Plant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'varchar', enum: PlantStatus, default: PlantStatus.OK })
  status: PlantStatus;

  @Column('float')
  humidity: number;

  @Column('float')
  light: number;

  @Column('float')
  temperature: number;

  @Column()
  location: string;

  @Column({ type: 'datetime' })
  lastSync: Date;

  @ManyToOne(() => User, (user) => user.plants, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => PlantHistory, (history) => history.plant, {
    cascade: true,
    eager: true,
  })
  history: PlantHistory[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
