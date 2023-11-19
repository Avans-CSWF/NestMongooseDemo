import { Injectable, Logger } from "@nestjs/common";
import { Cook } from './schemas/cook.schema';
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class CooksService {
  private readonly logger: Logger = new Logger(CooksService.name);
  constructor(@InjectModel(Cook.name) private readonly cookModel: Model<Cook>) {}
  async create(cook: Cook) : Promise<Cook> {
    this.logger.log(`creating cook: ${JSON.stringify(cook)}`);

    const newCook = new this.cookModel(cook);
    return await newCook.save();
  }

  async findAll() : Promise<Cook[]> {
    this.logger.log(`finding all cooks`);

    return await this.cookModel.find().exec();
  }

  async findOne(id: string) : Promise<Cook> {
    this.logger.log(`finding cook with id: ${id}`);

    return await this.cookModel.findById(id).exec();
  }

  async update(id: string, cook: Cook) : Promise<Cook> {
    this.logger.log(`updating cook with id: ${id}`);

    return await this.cookModel.findByIdAndUpdate(id, cook, {new: true});
  }

  async remove(id: string) : Promise<Cook> {
    this.logger.log(`removing cook with id: ${id}`);

    return await this.cookModel.findByIdAndRemove(id);
  }
}