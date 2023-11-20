import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from "@nestjs/common";
import { RecommendationsService } from './recommendations.service';
import { CreateRecommendationDto } from './dto/create-recommendation.dto';
import { UpdateRecommendationDto } from './dto/update-recommendation.dto';
import { Neo4jService } from "nest-neo4j/dist";
import { Public } from "../auth/decorators/public.decorator";

@Controller('recommendations')
export class RecommendationsController {
  private readonly logger = new Logger(RecommendationsController.name);
  constructor(
    private readonly recommendationsService: RecommendationsService,
    private readonly neo4jService: Neo4jService
  ) {}

  // @Public()
  // @Get()
  // async getHello() : Promise<any>{
  //   this.logger.log(`getHello`);
  //   const res = await this.neo4jService.read('MATCH (n) RETURN n LIMIT 25', {});
  //   this.logger.log(`got result: ${JSON.stringify(res)}`);
  //   //return `There are nodes in the database`;
  //   return `There are ${res.records[0].get('count')} nodes in the database`;
  // }

  @Post()
  create(@Body() createRecommendationDto: CreateRecommendationDto) {
    return this.recommendationsService.create(createRecommendationDto);
  }

  @Public()
  @Get()
  async findAll() {
    this.logger.log(`in findAll`);
    return await this.recommendationsService.findAllMeals();
  }

  @Get(':type')
  async findMealsByType(@Param('type') mealType: string) {
    return await this.recommendationsService.findMealsByType(mealType);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRecommendationDto: UpdateRecommendationDto) {
  //   return this.recommendationsService.update(+id, updateRecommendationDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.recommendationsService.remove(+id);
  // }
}
