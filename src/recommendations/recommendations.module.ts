import { forwardRef, Module } from "@nestjs/common";
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Neo4jModule } from 'nest-neo4j/dist';
import { Neo4jConfig } from 'nest-neo4j/dist/interfaces/neo4j-config.interface';
import { CooksModule } from "../cooks/cooks.module";
import { MealsModule } from "../meals/meals.module";

@Module({
  imports: [
    Neo4jModule.forRootAsync({
      imports: [
      ],
      inject: [ ConfigService ],
      useFactory: (configService: ConfigService): Neo4jConfig => ({
        scheme: configService.get('NEO4J_SCHEME') || 'neo4j',
        host: configService.get('NEO4J_HOST') || 'localhost',
        port: configService.get('NEO4J_PORT') || 7687,
        username: configService.get('NEO4J_USERNAME') || 'neo4j',
        password: configService.get('NEO4J_PASSWORD') || '',
        database: configService.get('NEO4J_DATABASE') || 'neo4j',
      })}),
    forwardRef(() => CooksModule),
    forwardRef(() => MealsModule),
  ],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
  exports: [RecommendationsService],
})
export class RecommendationsModule {}
