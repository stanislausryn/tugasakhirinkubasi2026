import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { CartModule } from '../cart/cart.module';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), CartModule],
  providers: [
    OrdersService,
    makeCounterProvider({ name: 'order_created_total', help: 'Total orders created' }),
  ],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
