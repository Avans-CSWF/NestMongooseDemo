import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from "@nestjs/common";
import { OrdersService } from './orders.service';
import { Order } from "./schemas/order.schema";

@Controller('orders')
export class OrdersController {

  private readonly logger:Logger = new Logger(OrdersController.name);
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() order: Order) {
    return this.ordersService.create(order);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() order: Order) {
    return this.ordersService.update(id, order);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
