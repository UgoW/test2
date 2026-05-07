import { DashboardMetricsService } from './dashboard-metrics.service';
import { Plant } from '../plants/entities/plant.entity';
import { PlantStatus } from '../plants/entities/plant-status.enum';
import { Location } from '../locations/entities/location.entity';

describe('DashboardMetricsService', () => {
  let service: DashboardMetricsService;
  let seed = 0;

  const makeLocation = (name = 'Salon'): Location =>
    ({
      id: 'location-1',
      name,
      user: undefined as any,
      plants: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }) as Location;

  const makePlant = (overrides: Partial<Plant>): Plant =>
    ({
      id: `plant-${++seed}`,
      name: 'Plant',
      status: PlantStatus.OK,
      humidity: 50,
      light: 500,
      temperature: 22,
      location: makeLocation(),
      lastSync: new Date('2026-04-20T10:00:00.000Z'),
      history: [],
      user: undefined as any,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: undefined,
      ...overrides,
    }) as Plant;

  beforeEach(() => {
    service = new DashboardMetricsService();
  });

  it('should compute KPI summary with rounded avgHealthPercent', () => {
    const plants = [
      makePlant({ status: PlantStatus.OK }),
      makePlant({ status: PlantStatus.OK }),
      makePlant({ status: PlantStatus.ATTENTION }),
      makePlant({ status: PlantStatus.CRITICAL }),
    ];

    expect(service.buildKpis(plants)).toEqual({
      totalPlants: 4,
      okPlants: 2,
      attentionPlants: 1,
      criticalPlants: 1,
      avgHealthPercent: 63,
    });
  });

  it('should build alerts with threshold reasons by status', () => {
    const plants = [
      makePlant({
        id: 'a1',
        name: 'Attention',
        status: PlantStatus.ATTENTION,
        humidity: 39,
        light: 200,
      }),
      makePlant({
        id: 'c1',
        name: 'Critical',
        status: PlantStatus.CRITICAL,
        humidity: 20,
        light: 120,
      }),
      makePlant({ id: 'o1', status: PlantStatus.OK }),
    ];

    const alerts = service.buildAlerts(plants);

    expect(alerts).toHaveLength(2);
    expect(alerts[0].reasons).toEqual(['humidite_basse', 'lumiere_insuffisante']);
    expect(alerts[1].reasons).toEqual(['humidite_critique', 'lumiere_critique']);
  });

  it('should aggregate zone stats and infer globalStatus', () => {
    const plants = [
      makePlant({ location: makeLocation('Salon'), status: PlantStatus.OK }),
      makePlant({ location: makeLocation('Salon'), status: PlantStatus.ATTENTION }),
      makePlant({ location: makeLocation('Terrasse'), status: PlantStatus.CRITICAL }),
    ];

    const zones = service.buildZones(plants);

    expect(zones).toEqual(
      expect.arrayContaining([
        {
          zoneName: 'Salon',
          total: 2,
          okCount: 1,
          attentionCount: 1,
          criticalCount: 0,
          globalStatus: PlantStatus.ATTENTION,
        },
        {
          zoneName: 'Terrasse',
          total: 1,
          okCount: 0,
          attentionCount: 0,
          criticalCount: 1,
          globalStatus: PlantStatus.CRITICAL,
        },
      ]),
    );
  });

  it('should compute last sync status from elapsed minutes', () => {
    const referenceNow = new Date('2026-04-20T10:40:00.000Z');
    const plants = [
      makePlant({ lastSync: new Date('2026-04-20T10:35:00.000Z') }),
      makePlant({ lastSync: new Date('2026-04-20T10:20:00.000Z') }),
    ];

    const sync = service.buildLastSync(plants, referenceNow);
    expect(sync.statusSync).toBe('ok');
    expect(sync.minutesElapsed).toBe(5);

    const warning = service.buildLastSync(
      [makePlant({ lastSync: new Date('2026-04-20T10:20:00.000Z') })],
      referenceNow,
    );
    expect(warning.statusSync).toBe('warning');

    const critical = service.buildLastSync(
      [makePlant({ lastSync: new Date('2026-04-20T09:50:00.000Z') })],
      referenceNow,
    );
    expect(critical.statusSync).toBe('critical');
  });
});
