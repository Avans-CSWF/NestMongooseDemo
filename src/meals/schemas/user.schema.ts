// import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
// import { v4 as uuid } from 'uuid';
// import {IsBoolean, IsInt, IsMongoId, IsString} from 'class-validator';
//
// @Schema()
// export class User {
//   //@Prop({ default: uuid })
//   @IsMongoId()
//   _id!: string;
//
//   @Prop({ required: true })
//   name!: string;
//
//   @Prop({ required: true })
//   emailAddress!: string;
//
//   @Prop({ required: true })
//   isActive!: boolean;
//
//   @Prop({ required: false })
//   profileImageUrl!: string;
//
//   @Prop({ required: false })
//   roles: string[];
// }
//
// export const UserSchema = SchemaFactory.createForClass(User);
