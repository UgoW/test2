import { PlantStatus } from '../../src/plants/entities/plant-status.enum';

export const dashboardSeedPlants = [
  {
    name: 'Ficus du salon',
    status: PlantStatus.OK,
    humidity: 58,
    light: 520,
    temperature: 22,
    location: 'Salon',
  },
  {
    name: 'Calathea bureau',
    status: PlantStatus.ATTENTION,
    humidity: 36,
    light: 280,
    temperature: 21,
    location: 'Bureau',
  },
  {
    name: 'Monstera terrasse',
    status: PlantStatus.CRITICAL,
    humidity: 30,
    light: 180,
    temperature: 18,
    location: 'Terrasse',
  },
  {
    name: 'Pothos salon',
    status: PlantStatus.OK,
    humidity: 49,
    light: 470,
    temperature: 23,
    location: 'Salon',
  },
];
