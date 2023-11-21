import { Injectable } from '@nestjs/common';
import { Meal } from './schemas/meal.schema';
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { RecommendationsService } from "../recommendations/recommendations.service";

@Injectable()
export class MealsService {

  constructor(
    @InjectModel(Meal.name) private readonly mealModel: Model<Meal>,
    private readonly recommendationsService: RecommendationsService,
  ) {}
  async create(meal: Meal) : Promise<Meal> {
    const newMeal = new this.mealModel(meal);
    const createdMeal = await newMeal.save();

    const n4jResult = await this.recommendationsService.createOrUpdateMeal(createdMeal);

    return createdMeal;
  }

  async findAll() : Promise<Meal[]> {
    return await this.mealModel.find().exec();
  }

  async findOne(id: string) : Promise<Meal> {

    return await this.mealModel.findById(id).exec();
  }

  async update(id: string, meal: Meal) : Promise<Meal> {
    return this.mealModel.findByIdAndUpdate(id, meal, { new: true });
  }

  async remove(id: string) : Promise<Meal> {
    return await this.mealModel.findByIdAndRemove(id);
  }
}
