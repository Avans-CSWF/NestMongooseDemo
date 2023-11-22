import { Injectable, Logger } from "@nestjs/common";
import { Neo4jService } from "nest-neo4j/dist";
import { Meal } from "../meals/schemas/meal.schema";
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

    this.logger.log(`result: ${JSON.stringify(result)}`);

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

    this.logger.log(`result: ${JSON.stringify(result)}`);

    return true // beter: try-catch en result.records.length > 0;
  }

  async findAllMeals() {
    const query = `
match(meal:Meal) return meal`;
    const result = await this.neo4jService.read(query,{});
    this.logger.log(`got result: ${JSON.stringify(result)}`);

      return result?.records;
  }

  async findMealsBySort(mealSort: string) {
    const query = `
match(meal:Meal) where meal.sort = '${mealSort}' return meal`;

    const result = await this.neo4jService.read(query,{});

    return result?.records;
  }

  async findMealsByCookId(cookId: string) {
    const query = `
 match(cook:Cook{mongoId:'${cookId}'})<-[RecipeCreatedBy]-(meal:Meal) return meal,cook`;
    const result = await this.neo4jService.read(query,{});

    return result?.records;
  }

  async findMealsByCookName(cookName: string) {
    const query = `
 match(cook:Cook{name:'${cookName}'})<-[RecipeCreatedBy]-(meal:Meal) return meal,cook`;
    const result = await this.neo4jService.read(query,{});

    return result?.records;
  }

  async findMealsBySimilarity(mealId: string) {
    const query = `
match(meal:Meal{mongoId:'${mealId}'})-[RecipeCreatedBy]->(cook:Cook)<-[RecipeCreatedBy]-(similarMeal:Meal) return similarMeal,cook`;

    const result = await this.neo4jService.read(query,{});

    return result?.records;
  }



  async remove(id: string) {
    const query = `
 match(n) where n.mongoId = '${id}' detach delete n`;
    const result = await this.neo4jService.write(query,{});

    return true;
  }
}
