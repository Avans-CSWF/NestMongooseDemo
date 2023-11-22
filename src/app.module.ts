import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule} from "@nestjs/mongoose";
import { MealsModule } from './meals/meals.module';
import { CooksModule } from './cooks/cooks.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RecommendationsModule } from './recommendations/recommendations.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRootAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('SHARE_A_MEAL_MONGO_CONNECTIONSTRING'),
      }),
    }),
    MealsModule,
    CooksModule,
    AuthModule,
    UsersModule,
    RecommendationsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


