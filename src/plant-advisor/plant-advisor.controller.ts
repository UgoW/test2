import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../common/decorators/user.decorator';
import { PlantAdvisorService } from './plant-advisor.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('advisor')
@Controller('advisor')
export class PlantAdvisorController {
  constructor(
    private readonly plantAdvisorService: PlantAdvisorService,
  ) {}

  /**
   * CONSEIL HEBDOMADAIRE GENERAL
   */
  @Get('weekly')
  @ApiOperation({
    summary: 'Get weekly plant advice',
    description:
      'Retourne un conseil hebdomadaire générique pour les plantes.',
  })
  @ApiResponse({
    status: 200,
    description: 'Weekly advice generated successfully',
    schema: {
      example: {
        success: true,
        type: 'weekly',
        advice:
          'Tournez vos plantes d’un quart de tour chaque semaine pour équilibrer leur croissance.',
      },
    },
  })
  async getWeeklyAdvice() {
    return this.plantAdvisorService.getWeeklyGeneralAdvice();
  }

  /**
   * CONSEIL PERSONNALISE
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('plant/:plantId')
  @ApiOperation({
    summary: 'Get personalized advice for a plant',
    description:
      'Analyse la plante sélectionnée avec tout le contexte utilisateur.',
  })
  @ApiParam({
    name: 'plantId',
    required: true,
    type: String,
    description: 'Plant UUID',
    example: 'c2c6f4d7-6f11-4e5d-97dc-a2b6c6f4f123',
  })
  @ApiResponse({
    status: 200,
    description: 'Personalized plant advice',
    schema: {
      example: {
        success: true,
        type: 'plant-context',
        plantId: 'uuid',
        advice:
          'Votre Monstera semble manquer de lumière naturelle...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Plant or user not found',
  })
  async getPlantAdvice(
    @CurrentUser() user: { userId: string },
    @Param('plantId') plantId: string,
  ) {
    return this.plantAdvisorService.getPlantSpecificAdvice(
      user.userId,
      plantId,
    );
  }
}