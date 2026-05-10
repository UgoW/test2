import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

import axios from 'axios';

import { Plant } from '../plants/entities/plant.entity';
import { User } from '../users/entities/user.entity';
import { PlantsService } from '../plants/plants.service';

@Injectable()
export class PlantAdvisorService {
  private readonly ollamaUrl =
    process.env.OLLAMA_URL || 'http://localhost:11434';

  private readonly model =
    process.env.OLLAMA_MODEL || 'llama3';

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Plant)
    private readonly plantsRepository: Repository<Plant>,

    private readonly plantsService: PlantsService,
  ) {}

  /**
   * CONSEIL GENERAL HEBDO
   */
  async getWeeklyGeneralAdvice() {
    const prompt = `Tu es botaniste. Donne UN conseil court pour plantes d'intérieur.
1 phrase max, 30 mots max, en français, ton naturel. Pas d'intro, pas de titre.`;

    const response = await this.askOllama(prompt).catch(() =>
      'Vérifiez l\'humidité du substrat avant d\'arroser : mieux vaut un sol légèrement sec qu\'un excès d\'eau.',
    );

    return {
      success: true,
      type: 'weekly',
      advice: response,
    };
  }

  /**
   * CONSEIL CONTEXTUALISE
   */
  async getPlantSpecificAdvice(userId: string, plantId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['locations'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const selectedPlant = await this.plantsService.findOne(userId, plantId);

    const userPlants = await this.plantsRepository.find({
      where: {
        user: { id: userId },
        deletedAt: IsNull(),
      },
      relations: ['location'],
      order: { updatedAt: 'DESC' },
    });

    const prompt = this.buildPlantContextPrompt(user, selectedPlant, userPlants);

    const response = await this.askOllama(prompt).catch(() =>
      this.buildFallbackAdvice(selectedPlant),
    );

    return {
      success: true,
      type: 'plant-context',
      plantId,
      advice: response,
    };
  }

  /**
   * APPEL OLLAMA
   */
  private async askOllama(prompt: string): Promise<string> {
    const response = await axios.post(
      `${this.ollamaUrl}/api/generate`,
      {
        model: this.model,
        prompt,
        stream: false,
        options: {
          num_predict: 80,
          temperature: 0.7,
          num_ctx: 1024,
        },
      },
      { timeout: 60000 },
    ).catch((err) => {
      console.error('[Ollama] URL:', this.ollamaUrl);
      console.error('[Ollama] Model:', this.model);
      console.error('[Ollama] Error:', err.message);
      throw err;
    });

    return response.data.response?.trim() || '';
  }

  /**
   * FALLBACK SANS IA
   */
  private buildFallbackAdvice(plant: Plant): string {
    const humidityNote =
      plant.humidity < 45
        ? 'Humidité basse, arrosez progressivement.'
        : plant.humidity > 70
          ? 'Humidité élevée, limitez l\'arrosage.'
          : 'Humidité correcte, continuez ainsi.';

    const lightNote =
      plant.light < 300
        ? 'Lumière faible, rapprochez d\'une fenêtre.'
        : plant.light > 800
          ? 'Lumière forte, évitez le soleil direct.'
          : 'Luminosité adaptée.';

    return `${plant.name} : ${humidityNote} ${lightNote}`;
  }

  /**
   * PROMPT IA CONTEXTUEL
   */
  private buildPlantContextPrompt(
    user: User,
    selectedPlant: Plant,
    userPlants: Plant[],
  ): string {
    return `Tu es expert plantes d'intérieur. Conseil en 2-3 phrases max (40 mots), en français.

Plante : ${selectedPlant.name}, humidité ${selectedPlant.humidity}%, lumière ${selectedPlant.light}lux, température ${selectedPlant.temperature}°C, état : ${selectedPlant.status}.
Pièce : ${selectedPlant.location?.name ?? 'inconnue'}.

Donne un diagnostic + 1 action immédiate. Pas d'intro, direct.`;
  }
}