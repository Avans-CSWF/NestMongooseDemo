import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsInt, IsMongoId, IsString } from 'class-validator';
import { Meal } from '../../meals/schemas/meal.schema';
import { User } from '../../users/schemas/user.schema';
import mongoose from 'mongoose';

@Schema()
export class Order {
  @IsMongoId()
  _id!: string;

  @Prop({ required:false, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  orderedBy!: User;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  orderedAt!: Date;

  @Prop({ required: false })
  deliveredAt!: Date;

  @Prop({ required: true })
  isPayed!: boolean;

  @Prop({ required: false })
  items: Meal[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
