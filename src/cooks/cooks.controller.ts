import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Logger } from "@nestjs/common";
import { CooksService } from './cooks.service';
import { Cook } from "./schemas/cook.schema";

@Controller('cooks')
export class CooksController {

  private readonly logger: Logger = new Logger(CooksController.name);
  constructor(private readonly cooksService: CooksService) {}

  @Post()
  async create(@Body() newCook: Cook) : Promise<Cook> {
    this.logger.log(`creating cook: ${JSON.stringify(newCook)}`);

    return await this.cooksService.create(newCook);
  }

  @Get()
  async findAll() : Promise<Cook[]> {
    return await this.cooksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) : Promise<Cook> {
    return await this.cooksService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatedCook: Cook) : Promise<Cook> {
    return await this.cooksService.update(id, updatedCook);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) : Promise<Cook> {
    return await this.cooksService.remove(id);
  }
}
