import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plant } from '../plants/entities/plant.entity';
import { User } from '../users/entities/user.entity';
import { UserProgress } from './entities/user-progress.entity';
import { GamificationController } from './gamification.controller';
import { GamificationRulesService } from './gamification-rules.service';
import { GamificationService } from './gamification.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserProgress, Plant, User])],
  controllers: [GamificationController],
  providers: [GamificationService, GamificationRulesService],
})
export class GamificationModule {}
