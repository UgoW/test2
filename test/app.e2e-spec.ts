import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plant } from '../src/plants/entities/plant.entity';
import { User } from '../src/users/entities/user.entity';
import { UserProgress } from '../src/gamification/entities/user-progress.entity';
import { dashboardSeedPlants } from './fixtures/plants.seed';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';

process.env.DATABASE_PATH = ':memory:';
process.env.JWT_SECRET = 'test-secret';

describe('Dashboard and Plants (e2e)', () => {
  let app: INestApplication<App>;
  let plantsRepository: Repository<Plant>;
  let usersRepository: Repository<User>;
  let progressRepository: Repository<UserProgress>;
  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());
    await app.init();

    plantsRepository = moduleFixture.get<Repository<Plant>>(getRepositoryToken(Plant));
    usersRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    progressRepository = moduleFixture.get<Repository<UserProgress>>(getRepositoryToken(UserProgress));
  });

  beforeEach(async () => {
    await progressRepository.clear();
    await plantsRepository.clear();
    await usersRepository.clear();

    const email = `dashboard-${Date.now()}@example.com`;
    const password = 'StrongPass123!';

    await request(app.getHttpServer()).post('/auth/register').send({ email, password }).expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect(201);

    accessToken = loginResponse.body.data.tokens.accessToken;
    userId = loginResponse.body.data.user.id;

    const now = Date.now();
    await plantsRepository.save(
      dashboardSeedPlants.map((plant, index) =>
        plantsRepository.create({
          ...plant,
          lastSync: new Date(now - index * 7 * 60_000),
          user: { id: userId } as User,
          history: [],
        }),
      ),
    );
  });

  it('GET /dashboard/overview should return KPI, alerts, zones, sync and quick actions', async () => {
    const response = await request(app.getHttpServer())
      .get('/dashboard/overview')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.kpis).toEqual({
      totalPlants: 4,
      okPlants: 2,
      attentionPlants: 1,
      criticalPlants: 1,
      avgHealthPercent: 63,
    });
    expect(response.body.data.alerts).toHaveLength(2);
    expect(response.body.data.zones).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ zoneName: 'Salon', total: 2, globalStatus: 'ok' }),
        expect.objectContaining({ zoneName: 'Bureau', total: 1, globalStatus: 'attention' }),
        expect.objectContaining({ zoneName: 'Terrasse', total: 1, globalStatus: 'critical' }),
      ]),
    );
    expect(response.body.data.lastSync.statusSync).toMatch(/ok|warning|critical/);
    expect(response.body.data.quickActions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'add-plant', enabled: true }),
        expect.objectContaining({ id: 'sync-now', enabled: true }),
        expect.objectContaining({ id: 'export-report', enabled: true }),
      ]),
    );
  });

  it('quick actions endpoints should create, sync and export plants', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/plants')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Aloe cuisine',
        status: 'ok',
        humidity: 55,
        light: 450,
        temperature: 23,
        location: 'Cuisine',
      })
      .expect(201);

    expect(createResponse.body.success).toBe(true);
    expect(createResponse.body.data.name).toBe('Aloe cuisine');

    const syncResponse = await request(app.getHttpServer())
      .post('/plants/sync')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(syncResponse.body.success).toBe(true);
    expect(syncResponse.body.data.updatedCount).toBeGreaterThan(0);

    const exportResponse = await request(app.getHttpServer())
      .get('/plants/export')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(exportResponse.body.success).toBe(true);
    expect(exportResponse.body.data.format).toBe('csv');
    expect(exportResponse.body.data.content).toContain('name,status,humidity,light');
    expect(exportResponse.body.data.content).toContain('Aloe cuisine');
  });

  it('gamification endpoints should expose profile, update streak and claim health XP once per day', async () => {
    const profileResponse = await request(app.getHttpServer())
      .get('/gamification/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(profileResponse.body.success).toBe(true);
    expect(profileResponse.body.data.profession).toBe('jardinier');
    expect(profileResponse.body.data.level).toBe(1);
    expect(profileResponse.body.data.xp).toBe(0);
    expect(profileResponse.body.data.currentLoginStreak).toBe(0);

    const checkInResponse = await request(app.getHttpServer())
      .post('/gamification/check-in')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(checkInResponse.body.success).toBe(true);
    expect(checkInResponse.body.data.alreadyCheckedInToday).toBe(false);
    expect(checkInResponse.body.data.currentLoginStreak).toBe(1);

    const duplicateCheckInResponse = await request(app.getHttpServer())
      .post('/gamification/check-in')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(duplicateCheckInResponse.body.data.alreadyCheckedInToday).toBe(true);
    expect(duplicateCheckInResponse.body.data.currentLoginStreak).toBe(1);

    const firstClaimResponse = await request(app.getHttpServer())
      .post('/gamification/xp/claim-health')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(firstClaimResponse.body.success).toBe(true);
    expect(firstClaimResponse.body.data.claimed).toBe(true);
    expect(firstClaimResponse.body.data.healthyPlantsCount).toBe(2);
    expect(firstClaimResponse.body.data.xpGained).toBe(30);
    expect(firstClaimResponse.body.data.totalXp).toBe(30);

    const secondClaimResponse = await request(app.getHttpServer())
      .post('/gamification/xp/claim-health')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(secondClaimResponse.body.success).toBe(true);
    expect(secondClaimResponse.body.data.claimed).toBe(false);
    expect(secondClaimResponse.body.data.reason).toBe('already_claimed_today');
    expect(secondClaimResponse.body.data.xpGained).toBe(0);
  });

  afterAll(async () => {
    await app.close();
  });
});
