import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './cart-item.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { makeCounterProvider } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem])],
  providers: [
    CartService,
    makeCounterProvider({ name: 'cart_items_added_total', help: 'Total cart items added' }),
  ],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
