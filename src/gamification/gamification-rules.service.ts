import { Injectable } from '@nestjs/common';

type StreakUpdateResult = {
  currentLoginStreak: number;
  bestLoginStreak: number;
  alreadyCheckedInToday: boolean;
};

@Injectable()
export class GamificationRulesService {
  private readonly xpPerHealthyPlant = 15;

  calculateStreak(
    lastLoginAt: Date | null,
    currentLoginStreak: number,
    bestLoginStreak: number,
    now: Date,
  ): StreakUpdateResult {
    if (!lastLoginAt) {
      return {
        currentLoginStreak: 1,
        bestLoginStreak: Math.max(bestLoginStreak, 1),
        alreadyCheckedInToday: false,
      };
    }

    const dayDiff = this.getUtcDayDifference(lastLoginAt, now);

    if (dayDiff === 0) {
      return {
        currentLoginStreak,
        bestLoginStreak,
        alreadyCheckedInToday: true,
      };
    }

    const nextStreak = dayDiff === 1 ? currentLoginStreak + 1 : 1;

    return {
      currentLoginStreak: nextStreak,
      bestLoginStreak: Math.max(bestLoginStreak, nextStreak),
      alreadyCheckedInToday: false,
    };
  }

  calculateHealthXpGain(healthyPlantsCount: number): number {
    if (healthyPlantsCount <= 0) {
      return 0;
    }

    return healthyPlantsCount * this.xpPerHealthyPlant;
  }

  calculateLevel(xp: number): number {
    return Math.floor(Math.max(xp, 0) / 100) + 1;
  }

  isSameUtcDay(dateA: Date | null, dateB: Date): boolean {
    if (!dateA) {
      return false;
    }

    return this.getUtcDayDifference(dateA, dateB) === 0;
  }

  private getUtcDayDifference(from: Date, to: Date): number {
    const fromUtc = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());
    const toUtc = Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate());
    return Math.floor((toUtc - fromUtc) / 86_400_000);
  }
}
