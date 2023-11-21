import { Injectable, Logger } from "@nestjs/common";
import { CreateRecommendationDto } from './dto/create-recommendation.dto';
import { UpdateRecommendationDto } from './dto/update-recommendation.dto';
import { Neo4jService } from "nest-neo4j/dist";
import { Meal } from "../meals/schemas/meal.schema";
import { CooksService } from "../cooks/cooks.service";
import { Cook } from "../cooks/schemas/cook.schema";

@Injectable()
export class RecommendationsService {

  private readonly logger:Logger = new Logger(RecommendationsService.name);

  constructor(private readonly neo4jService: Neo4jService){
  }

  async createOrUpdateCook(newCook: Cook) {
    this.logger.log(`creating new cook: ${JSON.stringify(newCook)}`);

    const cypeherStatement = `
merge(cook:Cook {
    mongoId: '${newCook._id}'
})
on create set 
    cook.name = '${newCook.name}',
    cook.emailAddress = '${newCook.emailAddress}', 
    cook.isActive = ${newCook.isActive}
on match set 
    cook.name = '${newCook.name}',
    cook.emailAddress = '${newCook.emailAddress}', 
    cook.isActive = ${newCook.isActive}    
return cook`

    this.logger.log(`cypher statement: ${cypeherStatement}`);

    const result = await this.neo4jService.write(cypeherStatement, {});

    return result;
  }

  async createOrUpdateMeal(newMeal: Meal) {
    this.logger.log(`creating new meal: ${JSON.stringify(newMeal)}`);
    //const session = this.neo4jService.getWriteSession('neo4j');

    const cypherStatement = `
merge (meal:Meal {
      mongoId: '${newMeal._id}'
})
on create set
      meal.name= '${newMeal.name}',
      meal.description= '${newMeal.description}',
      meal.isVega= ${newMeal.isVega},
      meal.sort= '${newMeal.sort}',
      meal.cookMongoId= '${newMeal.cook._id}'
on match set
      meal.name= '${newMeal.name}',
      meal.description= '${newMeal.description}',
      meal.isVega= ${newMeal.isVega},
      meal.sort= '${newMeal.sort}',
      meal.cookMongoId= '${newMeal.cook._id}'
with meal 
match(cook:Cook {mongoId: '${newMeal.cook._id}'})
merge (meal)-[recipeCreatedBy:RecipeCreatedBy]->(cook)      
return meal,recipeCreatedBy, cook`
    const result = await this.neo4jService.write(cypherStatement, {});

    return result;
  }

  async findAll() {
    return this.findAllMeals();
  }

  async findAllMeals() {
    const result = await this.neo4jService.read('match(meal:Meal) return meal',{});
    this.logger.log(`got result: ${JSON.stringify(result)}`);

    return result?.records;
  }

  async findMealsByType(mealType: string) {
    let query = `match(meal:Meal) where meal.type = '${mealType}' return meal`;

    const result = await this.neo4jService.read(query,{});

    return result?.records;
  }

  findOne(id: number) {
    return `This action returns a #${id} recommendation`;
  }

  update(id: number, updateRecommendationDto: UpdateRecommendationDto) {
    return `This action updates a #${id} recommendation`;
  }

  remove(id: number) {
    return `This action removes a #${id} recommendation`;
  }
}
