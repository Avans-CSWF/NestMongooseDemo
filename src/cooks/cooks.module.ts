import { forwardRef, Module } from "@nestjs/common";
import { CooksService } from './cooks.service';
import { CooksController } from './cooks.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { CookSchema } from "./schemas/cook.schema";
import { RecommendationsModule } from "../recommendations/recommendations.module";
import { MealsModule } from "../meals/meals.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Cook', schema: CookSchema }]),
    forwardRef(() => RecommendationsModule),
    forwardRef(() => MealsModule),
  ],
  controllers: [CooksController],
  providers: [CooksService],
  exports: [CooksService],
})
export class CooksModule {}
