import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from "@nestjs/common";
import { MealsService } from './meals.service';
import { Meal } from "./schemas/meal.schema";
// import { CreateMealDto } from './dto/create-meal.dto';
// import { UpdateMealDto } from './dto/update-meal.dto';

@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post()
  async create(@Body() newMeal: Meal) : Promise<Meal> {
    // let aMeal = new Meal();
    // // aMeal.id = '0';
    // aMeal.title = 'test';
    // aMeal.description = 'test';
    // aMeal.dateServed = new Date(2023, 11, 24, 18, 15);
    // aMeal.isVega = false;
    // aMeal.cook = 'test';
    // aMeal.sort = 'Lunch';
    return await this.mealsService.create(newMeal);
  }

  @Get()
  async findAll() : Promise<Meal[]> {
    return await this.mealsService.findAll();
  }

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
