import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';
import { IsBoolean, IsEmail, IsInt, IsMongoId, IsString } from "class-validator";

@Schema()
export class Cook {
  //@Prop({ default: uuid })
  @IsMongoId()
  _id!: string;

  @Prop({ required: true })
  name!: string;

  @IsEmail()
  @Prop({ required: true })
  emailAddress!: string;

  @Prop({ required: true })
  isActive!: boolean;

  @Prop({ required: false })
  profileImageUrl!: string;

  @Prop({ required: false })
  specialties: string[];
}

export const CookSchema = SchemaFactory.createForClass(Cook);
