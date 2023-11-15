import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import {IsBoolean, IsInt, IsMongoId, IsString} from 'class-validator';

@Schema()
export class User {
  @IsMongoId()
  _id!: string;

  @Prop({ required: true })
  username!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ required: true })
  @IsBoolean()
  isActive!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
