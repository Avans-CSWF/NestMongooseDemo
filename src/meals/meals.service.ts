import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Meal } from './schemas/meal.schema';
import { Connection, Model } from "mongoose";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { RecommendationsService } from "../recommendations/recommendations.service";
import { transaction } from "../app.helpers";
import { CooksService } from "../cooks/cooks.service";

@Injectable()
export class MealsService {

  constructor(
    @InjectModel(Meal.name) private readonly mealModel: Model<Meal>,
    @InjectConnection() private connection: Connection,
    // NOTE: circular refs, Anti pattern!!!
    // Use proper component design and avoid circular references -->
    @Inject(forwardRef(() => RecommendationsService)) private readonly recommendationsService: RecommendationsService,
    @Inject(forwardRef(() => CooksService)) private readonly cooksService: CooksService,
  ) {}
  async create(meal: Meal) : Promise<Meal> {
    // Using transactions -->
    // return transaction(this.connection, async session => {
    //   const newMeal = new this.mealModel(meal);
    //   const createdMeal = await newMeal.save({session});
    //
    //   const n4jResult = await this.recommendationsService.createOrUpdateMeal(createdMeal);
    //
    //   if (!n4jResult) {
    //     await session.abortTransaction();
    //   }
    //   else {
    //     await session.commitTransaction();
    //   }
    //
    //   return createdMeal;
    // });
    const newMeal = new this.mealModel(meal);
    const createdMeal = await newMeal.save();

    const n4jResult = await this.recommendationsService.createOrUpdateMeal(createdMeal);
    // TODO: wrap in transaction -->
    if (!n4jResult) {
      await this.mealModel.findByIdAndRemove(createdMeal._id);
    }
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
