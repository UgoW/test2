import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationsService } from './locations.service';

@ApiTags('locations')
@Controller('locations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create or reuse a location for the authenticated user' })
  @ApiResponse({ status: 201, description: 'Location created successfully' })
  async create(
    @CurrentUser() user: { userId: string },
    @Body() createLocationDto: CreateLocationDto,
  ) {
    return this.locationsService.create(user.userId, createLocationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all locations for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Locations retrieved successfully' })
  async findAll(@CurrentUser() user: { userId: string }) {
    return this.locationsService.findAll(user.userId);
  }

  @Get(':id/plants')
  @ApiOperation({ summary: 'Get all plants for a location owned by the authenticated user' })
  @ApiResponse({ status: 200, description: 'Plants retrieved successfully for the location' })
  async findPlants(
    @CurrentUser() user: { userId: string },
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.locationsService.findPlants(user.userId, id);
  }
}