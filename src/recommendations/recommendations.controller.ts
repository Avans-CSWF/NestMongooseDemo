import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from "@nestjs/common";
import { RecommendationsService } from './recommendations.service';
import { Public } from "../auth/decorators/public.decorator";

@Controller('recommendations')
export class RecommendationsController {
  private readonly logger = new Logger(RecommendationsController.name);
  constructor(
    private readonly recommendationsService: RecommendationsService,
    //private readonly neo4jService: Neo4jService
  ) {}

  @Public()
  @Get()
  async findAll() {
    this.logger.log(`in findAll`);
    return await this.recommendationsService.findAllMeals();
  }

  @Get('by-type/:type')
  async findMealsByType(@Param('type') mealType: string) {
    return await this.recommendationsService.findMealsBySort(mealType);
  }

  @Get('by-cook-id/:cookId')
  async findMealsByCookId(@Param('cookId') cookId: string) {
    return await this.recommendationsService.findMealsByCookId(cookId);
  }

  @Get('by-cook-name/:cookName')
  async findMealsByCookName(@Param('cookName') cookName: string) {
    return await this.recommendationsService.findMealsByCookName(cookName);
  }

  @Get('by-similarity/:mealId')
  async findMealsBySimilarity(@Param('mealId') mealId: string) {
    return await this.recommendationsService.findMealsBySimilarity(mealId);
  }
}
