import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Plant } from '../plants/entities/plant.entity';
import { PlantStatus } from '../plants/entities/plant-status.enum';
import { User } from '../users/entities/user.entity';
import { UserProgress } from './entities/user-progress.entity';
import { GamificationRulesService } from './gamification-rules.service';

@Injectable()
export class GamificationService {
  constructor(
    @InjectRepository(UserProgress)
    private readonly progressRepository: Repository<UserProgress>,
    @InjectRepository(Plant)
    private readonly plantRepository: Repository<Plant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly rulesService: GamificationRulesService,
  ) {}

  async getProfile(userId: string) {
    const progress = await this.getOrCreateProgress(userId);

    return {
      profession: progress.profession,
      level: progress.level,
      xp: progress.xp,
      xpToNextLevel: this.xpToNextLevel(progress.xp),
      currentLoginStreak: progress.currentLoginStreak,
      bestLoginStreak: progress.bestLoginStreak,
      lastLoginAt: progress.lastLoginAt,
      totalXpEarned: progress.totalXpEarned,
      lastHealthXpClaimAt: progress.lastHealthXpClaimAt,
    };
  }

  async checkIn(userId: string, now: Date = new Date()) {
    const progress = await this.getOrCreateProgress(userId);
    const streak = this.rulesService.calculateStreak(
      progress.lastLoginAt,
      progress.currentLoginStreak,
      progress.bestLoginStreak,
      now,
    );

    if (!streak.alreadyCheckedInToday) {
      progress.currentLoginStreak = streak.currentLoginStreak;
      progress.bestLoginStreak = streak.bestLoginStreak;
      progress.lastLoginAt = now;
      await this.progressRepository.save(progress);
    }

    return {
      alreadyCheckedInToday: streak.alreadyCheckedInToday,
      currentLoginStreak: streak.currentLoginStreak,
      bestLoginStreak: streak.bestLoginStreak,
      lastLoginAt: progress.lastLoginAt,
    };
  }

  async claimHealthXp(userId: string, now: Date = new Date()) {
    const progress = await this.getOrCreateProgress(userId);

    if (this.rulesService.isSameUtcDay(progress.lastHealthXpClaimAt, now)) {
      return {
        claimed: false,
        reason: 'already_claimed_today',
        xpGained: 0,
        totalXp: progress.xp,
        level: progress.level,
        xpToNextLevel: this.xpToNextLevel(progress.xp),
      };
    }

    const healthyPlantsCount = await this.plantRepository.count({
      where: {
        user: { id: userId },
        deletedAt: IsNull(),
        status: PlantStatus.OK,
      },
    });

    const xpGained = this.rulesService.calculateHealthXpGain(healthyPlantsCount);

    progress.xp += xpGained;
    progress.totalXpEarned += xpGained;
    progress.level = this.rulesService.calculateLevel(progress.xp);
    progress.lastHealthXpClaimAt = now;

    await this.progressRepository.save(progress);

    return {
      claimed: true,
      healthyPlantsCount,
      xpGained,
      totalXp: progress.xp,
      level: progress.level,
      xpToNextLevel: this.xpToNextLevel(progress.xp),
      claimedAt: now,
    };
  }

  private async getOrCreateProgress(userId: string): Promise<UserProgress> {
    let progress = await this.progressRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (progress) {
      return progress;
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    progress = this.progressRepository.create({
      user,
      currentLoginStreak: 0,
      bestLoginStreak: 0,
      lastLoginAt: null,
      xp: 0,
      totalXpEarned: 0,
      level: 1,
      profession: 'jardinier',
      lastHealthXpClaimAt: null,
    });

    return this.progressRepository.save(progress);
  }

  private xpToNextLevel(xp: number): number {
    const nextThreshold = Math.ceil((xp + 1) / 100) * 100;
    return nextThreshold - xp;
  }
}
