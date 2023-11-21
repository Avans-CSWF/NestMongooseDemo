import { Module } from '@nestjs/common';
import { MealsService } from './meals.service';
import { MealsController } from './meals.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { MealSchema } from "./schemas/meal.schema";
import { RecommendationsModule } from "../recommendations/recommendations.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Meal', schema: MealSchema }]),
    RecommendationsModule,
  ],
  controllers: [MealsController],
  providers: [MealsService],
})
export class MealsModule {}
