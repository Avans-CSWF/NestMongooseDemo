import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule} from "@nestjs/mongoose";
import { MealsModule } from './meals/meals.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/share-a-meal'),
    MealsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
