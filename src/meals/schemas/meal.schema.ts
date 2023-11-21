import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';
import { IsMongoId } from "class-validator";
//import { User } from "./user.schema";
import { Cook } from "../../cooks/schemas/cook.schema";
import mongoose from "mongoose";

@Schema()
export class Meal {
  //@Prop({ default: uuid })
  @IsMongoId()
  _id!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  isVega!: boolean;

  // @Prop({ required: true })
  // dateServed!: Date;

  // @Prop({ required: true, type: Object })
  // sort!: string;
  @Prop({ required: true })
  sort!: string;
  // @Prop({ required: true, type: { id: String, name: String } })
  @Prop({ required:false, type: mongoose.Schema.Types.ObjectId, ref: 'Cook' })
  cook!: Cook;
}

export const MealSchema = SchemaFactory.createForClass(Meal);
