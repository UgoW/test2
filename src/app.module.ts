import 'node:crypto';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AppConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';
import { LocationsModule } from './locations/locations.module';
import { PlantsModule } from './plants/plants.module';
import { UsersModule } from './users/users.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { GamificationModule } from './gamification/gamification.module';
import { PlantAdvisorModule } from './plant-advisor/plant-advisor.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('app.databasePath'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('app.environment') !== 'production',
        logging: configService.get<string>('app.environment') !== 'production',
      }),
    }),
    AuthModule,
    UsersModule,
    LocationsModule,
    PlantsModule,
    DashboardModule,
    GamificationModule,
    PlantAdvisorModule,
  ],
})
export class AppModule {}

