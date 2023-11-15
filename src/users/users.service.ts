import * as bcrypt from 'bcrypt';
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from './schemas/user.schema';
import { Model } from "mongoose";

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
    this.seedDb();
  }

  async seedDb() {
    let currentUsers = await this.findAll();
    if (currentUsers.length > 0) {
      this.logger.log('db already seeded');
      return;
    }
    this.logger.log('seeding db');
    //const newCook = new this.cookModel(cook);
    let seedUser1 = new User();
    seedUser1.username = 'mustrumridcully';
    seedUser1.passwordHash = await this.generateHashedPassword('Hallo123');
    seedUser1.isActive = true;
    const newSeedUser1 = new this.userModel(seedUser1);
    await newSeedUser1.save();

    let seedUser2 = new User();
    seedUser2.username = 'rincewind';
    seedUser2.passwordHash = await this.generateHashedPassword('Hallo123');
    seedUser2.isActive = true;
    const newSeedUser2 = new this.userModel(seedUser2);
    await newSeedUser2.save();

  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }
  async findOne(username: string): Promise<User> {
    return await this.userModel.findOne({username: username}).exec();
  }

  async generateHashedPassword(plainTextPassword: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(plainTextPassword, saltOrRounds);
  }

  async validatePassword(givenPassword: string, passwordHash: string): Promise<boolean> {
    return await bcrypt.compare(givenPassword, passwordHash);
  }
}
