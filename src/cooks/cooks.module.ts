import { Module } from '@nestjs/common';
import { CooksService } from './cooks.service';
import { CooksController } from './cooks.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { CookSchema } from "./schemas/cook.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Cook', schema: CookSchema }])
  ],
  controllers: [CooksController],
  providers: [CooksService],
})
export class CooksModule {}
