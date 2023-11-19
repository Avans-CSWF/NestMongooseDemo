import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule} from "@nestjs/mongoose";
import { MealsModule } from './meals/meals.module';
import { CooksModule } from './cooks/cooks.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    // MongooseModule.forRoot('mongodb://localhost:27017/share-a-meal'),
    MongooseModule.forRoot(String(process.env.SHARE_A_MEAL_MONGO_CONNECTIONSTRING)),
    MealsModule,
    CooksModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
