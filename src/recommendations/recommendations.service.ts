import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { Neo4jService } from "nest-neo4j/dist";
import { Meal } from "../meals/schemas/meal.schema";
import { Cook } from "../cooks/schemas/cook.schema";
import { MealsService } from "../meals/meals.service";
import { CooksService } from "../cooks/cooks.service";

@Injectable()
export class RecommendationsService {
  // TODO: use cypher query parameters in queries (https://neo4j.com/docs/cypher-manual/current/syntax/parameters/)
  private readonly logger:Logger = new Logger(RecommendationsService.name);

  constructor(
    private readonly neo4jService: Neo4jService,
    // NOTE: circular refs, Anti pattern!!!
    // Use proper component design and avoid circular references -->
    @Inject(forwardRef(() => MealsService)) private readonly mealsService: MealsService,
    @Inject(forwardRef(() => MealsService)) private readonly cooksService: CooksService,
  ){
  }

  async createOrUpdateCook(newCook: Cook) {
    this.logger.log(`creating new cook: ${JSON.stringify(newCook)}`);

//     const cypeherStatement = `
// merge(cook:Cook {
//     mongoId: '${newCook._id}'
// })
// on create set
//     cook.name = '${newCook.name}',
//     cook.emailAddress = '${newCook.emailAddress}',
//     cook.isActive = ${newCook.isActive}
// on match set
//     cook.name = '${newCook.name}',
//     cook.emailAddress = '${newCook.emailAddress}',
//     cook.isActive = ${newCook.isActive}
// return cook`
    const cypeherStatement = `
merge(cook:Cook {
    mongoId: $mongoId
})
on create set 
    cook.name = $name,
    cook.emailAddress = $emailAddress, 
    cook.isActive = $isActive
on match set 
    cook.name = $name,
    cook.emailAddress = $emailAddress, 
    cook.isActive = $isActive    
return cook
`;

    //this.logger.log(`cypher statement: ${cypeherStatement}`);

    const result = await this.neo4jService.write(
      cypeherStatement,
      {
        mongoId: newCook._id,
        name: newCook.name,
        emailAddress: newCook.emailAddress,
        isActive: newCook.isActive
    });

    this.logger.log(`result: ${JSON.stringify(result)}`);

    return result;
  }

  async createOrUpdateMeal(newMeal: Meal) {
    this.logger.log(`creating new meal: ${JSON.stringify(newMeal)}`);
    //const session = this.neo4jService.getWriteSession('neo4j');

//     const cypherStatement = `
// merge (meal:Meal {
//       mongoId: '${newMeal._id}'
// })
// on create set
//       meal.name= '${newMeal.name}',
//       meal.description= '${newMeal.description}',
//       meal.isVega= ${newMeal.isVega},
//       meal.sort= '${newMeal.sort}',
//       meal.cookMongoId= '${newMeal.cook._id}'
// on match set
//       meal.name= '${newMeal.name}',
//       meal.description= '${newMeal.description}',
//       meal.isVega= ${newMeal.isVega},
//       meal.sort= '${newMeal.sort}',
//       meal.cookMongoId= '${newMeal.cook._id}'
// with meal
// match(cook:Cook {mongoId: '${newMeal.cook._id}'})
// merge (meal)-[recipeCreatedBy:RecipeCreatedBy]->(cook)
// return meal,recipeCreatedBy, cook
// `
    const cypherStatement = `
  merge (meal:Meal {
      mongoId: $mongoId
})
on create set
      meal.name= $name,
      meal.description= $description,
      meal.isVega= $isVega,
      meal.sort= $sort,
      meal.cookMongoId= $cookMongoId
on match set
      meal.name= $name,
      meal.description= $description,
      meal.isVega= $isVega,
      meal.sort= $sort,
      meal.cookMongoId= $cookMongoId
with meal 
match(cook:Cook {mongoId: $cookMongoId})
merge (meal)-[recipeCreatedBy:RecipeCreatedBy]->(cook)      
return meal,recipeCreatedBy, cook
`;
    const result = await this.neo4jService.write(
      cypherStatement,
      {mongoId: newMeal._id,
        name: newMeal.name,
        description: newMeal.description,
        isVega: newMeal.isVega,
        sort: newMeal.sort,
        cookMongoId: newMeal.cook._id
      });

    this.logger.log(`result: ${JSON.stringify(result)}`);

    return true // beter: try-catch en result.records.length > 0;
  }

  async findAllMeals() {
    const query = `
match(meal:Meal) return meal
`;

    const result = await this.neo4jService.read(query,{});
    this.logger.log(`got result: ${JSON.stringify(result)}`);

      return result?.records;
  }

  async findMealsBySort(mealSort: string) {
    const query = `
match(meal:Meal) where meal.sort = $mealSort return meal
`;

    const result = await this.neo4jService.read(query,{mealSort: mealSort});

    for(let meal of result?.records){
      this.logger.log(`${meal.get('meal').properties.mongoId}`);
      // TODO Mongo Id is here, fetch the matching document from Mongo to enrich model
      // Best to move this to a dedicated data enrichment service
      var mongoMealDocument = await this.mealsService.findOne(meal.get('meal')?.properties.mongoId);
      if (mongoMealDocument)
      {
        this.logger.log(`found mongo meal document: ${JSON.stringify(mongoMealDocument)}`);
      }
    }

    return result?.records;
  }

  async findMealsByCookId(cookId: string) {
    const query = `
 match(cook:Cook{mongoId:$cookId})<-[RecipeCreatedBy]-(meal:Meal) return meal,cook
 `;
    const result = await this.neo4jService.read(query,{cookId: cookId});

    return result?.records;
  }

  async findMealsByCookName(cookName: string) {
    const query = `
 match(cook:Cook{name:$cookName})<-[RecipeCreatedBy]-(meal:Meal) return meal,cook`;

    const result = await this.neo4jService.read(query,{ cookName: cookName });

    for ( let meal of result?.records ){
      this.logger.log(`${meal.get('meal').properties.mongoId}`);
      // TODO Mongo Id is here, fetch the matching document from Mongo to enrich model
      // Best to move this to a dedicated data enrichment service
      var mongoMealDocument = await this.mealsService.findOne(meal.get('meal')?.properties.mongoId);
      if (mongoMealDocument)
      {
        this.logger.log(`found mongo meal document: ${JSON.stringify(mongoMealDocument)}`);
      }
    }

    return result?.records;
  }

  async findMealsBySimilarity(mealId: string) {
    const query = `
match(meal:Meal{mongoId:$mealId})-[:RecipeCreatedBy]->(cook:Cook)<-[:RecipeCreatedBy]-(similarMeal:Meal) 
return similarMeal,cook
`;

    const result = await this.neo4jService.read(query,{mealId: mealId});
    // TODO: map QueryResult to model class

    for(let meal of result?.records){
      this.logger.log(`${meal.get('similarMeal').properties.mongoId}`);
      // TODO Mongo Id is here, fetch the matching document from Mongo to enrich model
      // Best to move this to a dedicated data enrichment service
      var mongoMealDocument = await this.mealsService.findOne(meal.get('similarMeal')?.properties.mongoId);
      if (mongoMealDocument)
      {
        this.logger.log(`found mongo meal document: ${JSON.stringify(mongoMealDocument)}`);
      }
    }

    return result?.records;
  }



  async remove(id: string) {
    const query = `
 match(n) where n.mongoId = $id detach delete n`;
    const result = await this.neo4jService.write(query,{id: id});

    return true;
  }
}
