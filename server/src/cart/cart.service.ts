import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartRepo: Repository<CartItem>,
    @InjectMetric('cart_items_added_total')
    private cartCounter: Counter<string>,
  ) {}

  async getCart(userId: string) {
    const items = await this.cartRepo.find({
      where: { userId },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
    const subtotal = items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0);
    return { items, subtotal, itemCount: items.length };
  }

  async addItem(userId: string, productId: string, quantity: number, size?: string, color?: string) {
    let item = await this.cartRepo.findOne({ where: { userId, productId, size, color } });
    if (item) {
      item.quantity += quantity;
      return this.cartRepo.save(item);
    }
    item = this.cartRepo.create({ userId, productId, quantity, size, color });
    this.cartCounter.inc({ quantity: quantity.toString() });
    return this.cartRepo.save(item);
  }

  async updateItem(userId: string, itemId: string, quantity: number) {
    const item = await this.cartRepo.findOne({ where: { id: itemId, userId } });
    if (!item) throw new NotFoundException('Cart item not found');
    if (quantity <= 0) return this.cartRepo.remove(item);
    item.quantity = quantity;
    return this.cartRepo.save(item);
  }

  async removeItem(userId: string, itemId: string) {
    const item = await this.cartRepo.findOne({ where: { id: itemId, userId } });
    if (!item) throw new NotFoundException('Cart item not found');
    return this.cartRepo.remove(item);
  }

  async clearCart(userId: string) {
    await this.cartRepo.delete({ userId });
  }
}
