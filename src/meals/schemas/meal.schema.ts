import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';
import { IsBoolean, IsMongoId, IsObject, IsString } from "class-validator";
import { Cook } from "../../cooks/schemas/cook.schema";
import mongoose from "mongoose";

@Schema()
export class Meal {
  //@Prop({ default: uuid })
  @IsMongoId()
  // @IsString()
  _id!: string;

  @Prop({ required: true })
  @IsString()
  name!: string;

  @Prop({ required: true })
  @IsString()
  description!: string;

  @Prop({ required: true })
  @IsBoolean()
  isVega!: boolean;

  @Prop({ required: true })
  @IsString()
  sort!: string;
  // @Prop({ required: true, type: { id: String, name: String } })

  @Prop({ required:false, type: mongoose.Schema.Types.ObjectId, ref: 'Cook' })
  @IsObject()
  cook!: Cook;
}

export const MealSchema = SchemaFactory.createForClass(Meal);
