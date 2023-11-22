import { Injectable, Logger } from "@nestjs/common";
import { Order } from "./schemas/order.schema";

@Injectable()
export class OrdersService {

  private readonly logger:Logger = new Logger(OrdersService.name);
  create(order: Order) {
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: string) {
    return `This action returns a #${id} order`;
  }

  update(id: string, order: Order) {
    return `This action updates a #${id} order`;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
