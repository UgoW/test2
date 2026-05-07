import 'reflect-metadata';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Plant } from '../plants/entities/plant.entity';
import { PlantHistory } from '../plants/entities/plant-history.entity';
import { PlantStatus } from '../plants/entities/plant-status.enum';
import { UserProgress } from '../gamification/entities/user-progress.entity';

const databasePath = process.env.DATABASE_PATH || './data/db.sqlite';
const seedPassword = process.env.SEED_DEFAULT_PASSWORD || 'StrongPass123!';

const dataSource = new DataSource({
  type: 'sqlite',
  database: databasePath,
  entities: [User, Plant, PlantHistory, UserProgress],
  synchronize: true,
  logging: false,
});

type SeedHistoryPoint = {
  minutesAgo: number;
  humidity: number;
  light: number;
};

type SeedPlant = {
  name: string;
  status: PlantStatus;
  humidity: number;
  light: number;
  temperature: number;
  location: string;
  minutesAgo: number;
  history: SeedHistoryPoint[];
};

type SeedProgress = {
  currentLoginStreak: number;
  bestLoginStreak: number;
  xp: number;
  totalXpEarned: number;
  level: number;
  profession: string;
  lastLoginAtMinutesAgo: number | null;
  lastHealthXpClaimAtMinutesAgo: number | null;
};

type SeedUser = {
  email: string;
  password?: string;
  progress?: SeedProgress;
  plants: SeedPlant[];
};

function buildHistory(seedHumidity: number, seedLight: number): SeedHistoryPoint[] {
  return [
    { minutesAgo: 360, humidity: Math.max(20, seedHumidity + 8), light: Math.max(120, seedLight - 120) },
    { minutesAgo: 300, humidity: Math.max(20, seedHumidity + 5), light: Math.max(120, seedLight - 80) },
    { minutesAgo: 240, humidity: Math.max(20, seedHumidity + 3), light: Math.max(120, seedLight - 40) },
    { minutesAgo: 180, humidity: Math.max(20, seedHumidity + 1), light: Math.max(120, seedLight - 15) },
    { minutesAgo: 120, humidity: Math.max(20, seedHumidity), light: Math.max(120, seedLight) },
    { minutesAgo: 60, humidity: Math.max(20, seedHumidity - 2), light: Math.max(120, seedLight + 25) },
    { minutesAgo: 15, humidity: Math.max(20, seedHumidity - 3), light: Math.max(120, seedLight + 40) },
  ];
}

const seedUsers: SeedUser[] = [
  {
    email: 'demo@jardin-magique.fr',
    password: 'DemoPlantes123!',
    progress: {
      currentLoginStreak: 9,
      bestLoginStreak: 23,
      xp: 380,
      totalXpEarned: 650,
      level: 4,
      profession: 'jardinier',
      lastLoginAtMinutesAgo: 45,
      lastHealthXpClaimAtMinutesAgo: 1600,
    },
    plants: [
      {
        name: 'Monstera Deliciosa - Salon Nord',
        status: PlantStatus.OK,
        humidity: 66,
        light: 540,
        temperature: 22.4,
        location: 'Salon',
        minutesAgo: 4,
        history: buildHistory(66, 540),
      },
      {
        name: 'Ficus Lyrata - Bureau Fenetre',
        status: PlantStatus.ATTENTION,
        humidity: 39,
        light: 280,
        temperature: 21.1,
        location: 'Bureau',
        minutesAgo: 12,
        history: buildHistory(39, 280),
      },
      {
        name: 'Calathea Orbifolia - Entree',
        status: PlantStatus.CRITICAL,
        humidity: 30,
        light: 190,
        temperature: 19.7,
        location: 'Entree',
        minutesAgo: 47,
        history: buildHistory(30, 190),
      },
      {
        name: 'Pilea Peperomioides - Cuisine',
        status: PlantStatus.OK,
        humidity: 62,
        light: 620,
        temperature: 23.0,
        location: 'Cuisine',
        minutesAgo: 7,
        history: buildHistory(62, 620),
      },
      {
        name: 'Sansevieria - Chambre',
        status: PlantStatus.ATTENTION,
        humidity: 40,
        light: 300,
        temperature: 20.4,
        location: 'Chambre',
        minutesAgo: 16,
        history: buildHistory(40, 300),
      },
      {
        name: 'Aloe Vera - Terrasse',
        status: PlantStatus.CRITICAL,
        humidity: 24,
        light: 210,
        temperature: 18.9,
        location: 'Terrasse',
        minutesAgo: 58,
        history: buildHistory(24, 210),
      },
      {
        name: 'Orchidee Phalaenopsis - Salle de bain',
        status: PlantStatus.OK,
        humidity: 73,
        light: 340,
        temperature: 24.1,
        location: 'Salle de bain',
        minutesAgo: 9,
        history: buildHistory(73, 340),
      },
      {
        name: 'Pothos Neon - Couloir',
        status: PlantStatus.ATTENTION,
        humidity: 34,
        light: 260,
        temperature: 20.2,
        location: 'Couloir',
        minutesAgo: 24,
        history: buildHistory(34, 260),
      },
    ],
  },
  {
    email: 'alice.dashboard@example.com',
    plants: [
      {
        name: 'Ficus elastica',
        status: PlantStatus.OK,
        humidity: 58,
        light: 520,
        temperature: 22,
        location: 'Salon',
        minutesAgo: 5,
        history: buildHistory(58, 520),
      },
      {
        name: 'Pothos Marble Queen',
        status: PlantStatus.ATTENTION,
        humidity: 38,
        light: 260,
        temperature: 21,
        location: 'Bureau',
        minutesAgo: 18,
        history: buildHistory(38, 260),
      },
      {
        name: 'Monstera Deliciosa',
        status: PlantStatus.CRITICAL,
        humidity: 29,
        light: 190,
        temperature: 19,
        location: 'Terrasse',
        minutesAgo: 42,
        history: buildHistory(29, 190),
      },
      {
        name: 'Dracaena Marginata',
        status: PlantStatus.OK,
        humidity: 51,
        light: 440,
        temperature: 23,
        location: 'Salon',
        minutesAgo: 9,
        history: buildHistory(51, 440),
      },
    ],
  },
  {
    email: 'bob.dashboard@example.com',
    plants: [
      {
        name: 'Calathea Orbifolia',
        status: PlantStatus.ATTENTION,
        humidity: 37,
        light: 280,
        temperature: 22,
        location: 'Chambre',
        minutesAgo: 14,
        history: buildHistory(37, 280),
      },
      {
        name: 'Sansevieria',
        status: PlantStatus.OK,
        humidity: 47,
        light: 360,
        temperature: 24,
        location: 'Entree',
        minutesAgo: 7,
        history: buildHistory(47, 360),
      },
      {
        name: 'Aloe Vera',
        status: PlantStatus.CRITICAL,
        humidity: 31,
        light: 210,
        temperature: 20,
        location: 'Cuisine',
        minutesAgo: 34,
        history: buildHistory(31, 210),
      },
    ],
  },
];

async function seed() {
  await dataSource.initialize();

  const userRepo = dataSource.getRepository(User);
  const plantRepo = dataSource.getRepository(Plant);
  const historyRepo = dataSource.getRepository(PlantHistory);
  const progressRepo = dataSource.getRepository(UserProgress);

  const now = Date.now();

  for (const item of seedUsers) {
    let user = await userRepo.findOne({ where: { email: item.email } });
    const passwordToUse = item.password ?? seedPassword;
    const passwordHash = await bcrypt.hash(passwordToUse, 10);

    if (!user) {
      user = userRepo.create({
        email: item.email,
        password: passwordHash,
        refreshTokenHash: null,
      });
      user = await userRepo.save(user);
      console.log(`Created user ${item.email}`);
    } else {
      user.password = passwordHash;
      user.refreshTokenHash = null;
      await userRepo.save(user);
      console.log(`User ${item.email} already exists`);
    }

    if (item.progress) {
      let progress = await progressRepo.findOne({
        where: { user: { id: user.id } },
        relations: ['user'],
      });

      if (!progress) {
        progress = progressRepo.create({
          user,
          currentLoginStreak: item.progress.currentLoginStreak,
          bestLoginStreak: item.progress.bestLoginStreak,
          xp: item.progress.xp,
          totalXpEarned: item.progress.totalXpEarned,
          level: item.progress.level,
          profession: item.progress.profession,
          lastLoginAt:
            item.progress.lastLoginAtMinutesAgo === null
              ? null
              : new Date(now - item.progress.lastLoginAtMinutesAgo * 60_000),
          lastHealthXpClaimAt:
            item.progress.lastHealthXpClaimAtMinutesAgo === null
              ? null
              : new Date(now - item.progress.lastHealthXpClaimAtMinutesAgo * 60_000),
        });
      } else {
        progress.currentLoginStreak = item.progress.currentLoginStreak;
        progress.bestLoginStreak = item.progress.bestLoginStreak;
        progress.xp = item.progress.xp;
        progress.totalXpEarned = item.progress.totalXpEarned;
        progress.level = item.progress.level;
        progress.profession = item.progress.profession;
        progress.lastLoginAt =
          item.progress.lastLoginAtMinutesAgo === null
            ? null
            : new Date(now - item.progress.lastLoginAtMinutesAgo * 60_000);
        progress.lastHealthXpClaimAt =
          item.progress.lastHealthXpClaimAtMinutesAgo === null
            ? null
            : new Date(now - item.progress.lastHealthXpClaimAtMinutesAgo * 60_000);
      }

      await progressRepo.save(progress);
      console.log(`Upserted gamification profile for ${item.email}`);
    }

    for (const plantData of item.plants) {
      const existingPlant = await plantRepo.findOne({
        where: {
          name: plantData.name,
          user: { id: user.id },
        },
      });

      if (existingPlant) {
        existingPlant.status = plantData.status;
        existingPlant.humidity = plantData.humidity;
        existingPlant.light = plantData.light;
        existingPlant.temperature = plantData.temperature;
        existingPlant.location = plantData.location;
        existingPlant.lastSync = new Date(now - plantData.minutesAgo * 60_000);

        await historyRepo
          .createQueryBuilder()
          .delete()
          .from(PlantHistory)
          .where('plantId = :plantId', { plantId: existingPlant.id })
          .execute();

        existingPlant.history = plantData.history.map((entry) =>
          historyRepo.create({
            timestamp: new Date(now - entry.minutesAgo * 60_000),
            humidity: entry.humidity,
            light: entry.light,
          }),
        );

        await plantRepo.save(existingPlant);
        console.log(`Updated plant ${plantData.name} for ${item.email}`);
        continue;
      }

      const plant = plantRepo.create({
        name: plantData.name,
        status: plantData.status,
        humidity: plantData.humidity,
        light: plantData.light,
        temperature: plantData.temperature,
        location: plantData.location,
        lastSync: new Date(now - plantData.minutesAgo * 60_000),
        user,
        history: plantData.history.map((entry) =>
          historyRepo.create({
            timestamp: new Date(now - entry.minutesAgo * 60_000),
            humidity: entry.humidity,
            light: entry.light,
          }),
        ),
      });

      await plantRepo.save(plant);
      console.log(`Added plant ${plantData.name} for ${item.email}`);
    }

    if (item.email === 'demo@jardin-magique.fr') {
      console.log('--- DEMO CREDENTIALS ---');
      console.log(`Email: ${item.email}`);
      console.log(`Password: ${passwordToUse}`);
      console.log(`Plants: ${item.plants.length}`);
      console.log('------------------------');
    }
  }

  await dataSource.destroy();
  console.log('Seed completed successfully.');
}

seed().catch(async (error: unknown) => {
  console.error('Seed failed:', error);
  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }
  process.exit(1);
});
