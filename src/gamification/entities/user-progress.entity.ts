import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('user_progress')
export class UserProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ default: 0 })
  currentLoginStreak: number;

  @Column({ default: 0 })
  bestLoginStreak: number;

  @Column({ type: 'datetime', nullable: true })
  lastLoginAt: Date | null;

  @Column({ default: 0 })
  xp: number;

  @Column({ default: 0 })
  totalXpEarned: number;

  @Column({ default: 1 })
  level: number;

  @Column({ type: 'varchar', default: 'jardinier' })
  profession: string;

  @Column({ type: 'datetime', nullable: true })
  lastHealthXpClaimAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
