import { forwardRef, Module } from "@nestjs/common";
import { MealsService } from './meals.service';
import { MealsController } from './meals.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { MealSchema } from "./schemas/meal.schema";
import { RecommendationsModule } from "../recommendations/recommendations.module";
import { CooksModule } from "../cooks/cooks.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Meal', schema: MealSchema }]),
    forwardRef(() => RecommendationsModule),
    forwardRef(() => CooksModule),
  ],
  controllers: [MealsController],
  providers: [MealsService],
  exports: [MealsService],
})
export class MealsModule {}
