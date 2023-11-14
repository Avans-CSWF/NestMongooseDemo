import { Injectable } from '@nestjs/common';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { Meal } from './schemas/meal.schema';
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class MealsService {

  constructor(@InjectModel(Meal.name) private readonly mealModel: Model<Meal>) {}
  async create(meal: Meal) : Promise<Meal> {
    const newMeal = new this.mealModel(meal);
    return await newMeal.save();
  }

  async findAll() : Promise<Meal[]> {
    return await this.mealModel.find().exec();
  }

  async findOne(id: string) : Promise<Meal> {
    return await this.mealModel.findById(id).exec();
  }

  async update(id: string, meal: Meal) : Promise<Meal> {
    return await this.mealModel.findByIdAndUpdate(id, meal, {new: true});
  }

  async remove(id: string) : Promise<Meal> {
    return await this.mealModel.findByIdAndRemove(id);
  }
}
