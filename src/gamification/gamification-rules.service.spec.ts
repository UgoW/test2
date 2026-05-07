import { beforeEach, describe, expect, it } from '@jest/globals';
import { GamificationRulesService } from './gamification-rules.service';

describe('GamificationRulesService', () => {
  let service: GamificationRulesService;

  beforeEach(() => {
    service = new GamificationRulesService();
  });

  it('should start streak at 1 on first check-in', () => {
    const now = new Date('2026-04-20T10:00:00.000Z');
    const result = service.calculateStreak(null, 0, 0, now);

    expect(result).toEqual({
      currentLoginStreak: 1,
      bestLoginStreak: 1,
      alreadyCheckedInToday: false,
    });
  });

  it('should increment streak for consecutive day check-in', () => {
    const now = new Date('2026-04-20T10:00:00.000Z');
    const yesterday = new Date('2026-04-19T07:00:00.000Z');
    const result = service.calculateStreak(yesterday, 3, 3, now);

    expect(result.currentLoginStreak).toBe(4);
    expect(result.bestLoginStreak).toBe(4);
    expect(result.alreadyCheckedInToday).toBe(false);
  });

  it('should not increment streak for same day check-in', () => {
    const now = new Date('2026-04-20T10:00:00.000Z');
    const earlierToday = new Date('2026-04-20T01:00:00.000Z');
    const result = service.calculateStreak(earlierToday, 5, 7, now);

    expect(result.currentLoginStreak).toBe(5);
    expect(result.bestLoginStreak).toBe(7);
    expect(result.alreadyCheckedInToday).toBe(true);
  });

  it('should reset streak if one day was missed', () => {
    const now = new Date('2026-04-20T10:00:00.000Z');
    const oldDate = new Date('2026-04-17T10:00:00.000Z');
    const result = service.calculateStreak(oldDate, 4, 9, now);

    expect(result.currentLoginStreak).toBe(1);
    expect(result.bestLoginStreak).toBe(9);
  });

  it('should compute health XP and level progression', () => {
    expect(service.calculateHealthXpGain(0)).toBe(0);
    expect(service.calculateHealthXpGain(3)).toBe(45);
    expect(service.calculateLevel(0)).toBe(1);
    expect(service.calculateLevel(99)).toBe(1);
    expect(service.calculateLevel(100)).toBe(2);
  });
});
