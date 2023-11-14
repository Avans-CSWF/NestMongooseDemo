import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';

@Schema()
export class Meal {
  @Prop({ default: uuid })
  id!: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  isVega!: boolean;

  @Prop({ required: true })
  dateServed!: Date;

  // @Prop({ required: true, type: Object })
  // sort!: string;
  @Prop({ required: true })
  sort!: string;
  // @Prop({ required: true, type: { id: String, name: String } })
  // cook!: string;
  @Prop({ required: true })
  cook!: string;
}

export const MealSchema = SchemaFactory.createForClass(Meal);
