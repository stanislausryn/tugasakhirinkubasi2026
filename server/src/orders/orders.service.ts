import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { CartService } from '../cart/cart.service';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    private cartService: CartService,
    @InjectMetric('order_created_total')
    private orderCounter: Counter<string>,
  ) {}

  private generateOrderNumber(): string {
    return 'ORD-' + Date.now().toString().slice(-6) + Math.random().toString(36).slice(2, 5).toUpperCase();
  }

  async createFromCart(userId: string, shippingAddress: any, promoCode?: string, notes?: string) {
    const cart = await this.cartService.getCart(userId);
    if (!cart.items.length) throw new Error('Cart is empty');

    const items = cart.items.map((i) => ({
      productId: i.productId,
      name: i.product.name,
      brand: i.product.brand,
      price: Number(i.product.price),
      quantity: i.quantity,
      size: i.size,
      color: i.color,
      image: i.product.images?.[0] || '',
    }));

    const subtotal = cart.subtotal;
    const discount = promoCode === 'MODERNO10' ? subtotal * 0.1 : 0;
    const shippingCost = subtotal >= 500000 ? 0 : 25000;
    const total = subtotal - discount + shippingCost;

    const order = this.orderRepo.create({
      orderNumber: this.generateOrderNumber(),
      userId,
      items,
      subtotal,
      discount,
      shippingCost,
      total,
      shippingAddress,
      promoCode,
      notes,
    });

    const saved = await this.orderRepo.save(order);
    await this.cartService.clearCart(userId);
    this.orderCounter.inc();
    return saved;
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.orderRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async findById(id: string, userId?: string): Promise<Order> {
    const where: any = { id };
    if (userId) where.userId = userId;
    const order = await this.orderRepo.findOne({ where });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findAll(page = 1, limit = 20): Promise<{ items: Order[]; total: number }> {
    const [items, total] = await this.orderRepo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total };
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    await this.orderRepo.update(id, { status });
    return this.findById(id);
  }

  async getRevenueStats() {
    const result = await this.orderRepo
      .createQueryBuilder('o')
      .select('SUM(o.total)', 'total')
      .addSelect('COUNT(*)', 'count')
      .where('o.status != :cancelled', { cancelled: OrderStatus.CANCELLED })
      .getRawOne();
    return result;
  }

  async count(): Promise<number> {
    return this.orderRepo.count();
  }
}
