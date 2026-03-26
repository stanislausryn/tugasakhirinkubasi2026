import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post()
  addItem(@Request() req, @Body() body: AddToCartDto) {
    return this.cartService.addItem(req.user.id, body.productId, body.quantity, body.size, body.color);
  }

  @Put(':id')
  updateItem(@Request() req, @Param('id') id: string, @Body() body: { quantity: number }) {
    return this.cartService.updateItem(req.user.id, id, body.quantity);
  }

  @Delete(':id')
  removeItem(@Request() req, @Param('id') id: string) {
    return this.cartService.removeItem(req.user.id, id);
  }

  @Delete()
  clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }
}
