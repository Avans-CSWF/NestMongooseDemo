import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Logger } from "@nestjs/common";
import { MealsService } from './meals.service';
import { Meal } from "./schemas/meal.schema";
import { Public } from "../auth/decorators/public.decorator";

//<host>/api/<endpoint>
@Controller('meals')
export class MealsController {

  private readonly logger: Logger = new Logger(MealsController.name);
  constructor(private readonly mealsService: MealsService) {}

  @Post()
  async create(@Body() newMeal: Meal) : Promise<Meal> {
    this.logger.log(`creating meal: ${JSON.stringify(newMeal)}`);

    return await this.mealsService.create(newMeal);
  }

  @Public()
  @Get()
  async findAll() : Promise<Meal[]> {
    this.logger.log(`finding all meals`);
    return await this.mealsService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) : Promise<Meal> {
    return await this.mealsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatedMeal: Meal) : Promise<Meal> {
    return await this.mealsService.update(id, updatedMeal);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) : Promise<Meal> {
    return await this.mealsService.remove(id);
  }
}
