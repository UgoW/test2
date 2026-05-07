import { Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { GamificationService } from './gamification.service';

@ApiTags('gamification')
@Controller('gamification')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get gamification profile (profession, level, xp, streaks)' })
  @ApiResponse({ status: 200, description: 'Gamification profile returned successfully' })
  async getProfile(@CurrentUser() user: { userId: string }) {
    return this.gamificationService.getProfile(user.userId);
  }

  @Post('check-in')
  @HttpCode(200)
  @ApiOperation({ summary: 'Register a daily login check-in and update streak' })
  @ApiResponse({ status: 200, description: 'Check-in computed successfully' })
  async checkIn(@CurrentUser() user: { userId: string }) {
    return this.gamificationService.checkIn(user.userId);
  }

  @Post('xp/claim-health')
  @HttpCode(200)
  @ApiOperation({ summary: 'Claim daily XP from healthy plants (status=ok)' })
  @ApiResponse({ status: 200, description: 'XP claim computed successfully' })
  async claimHealthXp(@CurrentUser() user: { userId: string }) {
    return this.gamificationService.claimHealthXp(user.userId);
  }
}
