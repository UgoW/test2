import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePlantDto } from './dto/create-plant.dto';
import { ListPlantsQueryDto } from './dto/list-plants-query.dto';
import { PlantsService } from './plants.service';

@ApiTags('plants')
@Controller('plants')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PlantsController {
  constructor(private readonly plantsService: PlantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new plant for the authenticated user' })
  @ApiResponse({ status: 201, description: 'Plant created successfully' })
  async create(
    @CurrentUser() user: { userId: string },
    @Body() createPlantDto: CreatePlantDto,
  ) {
    return this.plantsService.create(user.userId, createPlantDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get plants with optional filters and pagination' })
  @ApiResponse({ status: 200, description: 'Plants retrieved successfully with pagination metadata' })
  async findAll(
    @CurrentUser() user: { userId: string },
    @Query() query: ListPlantsQueryDto,
  ) {
    return this.plantsService.findAll(user.userId, query);
  }

  @Post('sync')
  @HttpCode(200)
  @ApiOperation({ summary: 'Trigger a global sync and update lastSync for all user plants' })
  @ApiResponse({ status: 200, description: 'Sync executed successfully' })
  async syncNow(@CurrentUser() user: { userId: string }) {
    return this.plantsService.syncNow(user.userId);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export user plants as CSV content' })
  @ApiResponse({ status: 200, description: 'Plants exported successfully' })
  async export(@CurrentUser() user: { userId: string }) {
    return this.plantsService.exportCsv(user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one plant with history for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Plant detail retrieved successfully' })
  async findOne(
    @CurrentUser() user: { userId: string },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.plantsService.findOne(user.userId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a plant owned by the authenticated user' })
  @ApiResponse({ status: 200, description: 'Plant deleted successfully' })
  async remove(
    @CurrentUser() user: { userId: string },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.plantsService.remove(user.userId, id);
  }
}
