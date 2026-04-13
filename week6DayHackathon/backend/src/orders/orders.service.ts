import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema';
import { CartService } from '../cart/cart.service';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { PaymentType } from '../common/enums/payment-type.enum';
import { UpdateOrderStatusDto, OrderItemDto, ShippingAddressDto } from './dto/order.dto';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private cartService: CartService,
    private usersService: UsersService,
    private productsService: ProductsService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async placeOrder(userId: string): Promise<OrderDocument> {
    const cart = await this.cartService.getCart(userId);
    if (!cart.items.length) throw new BadRequestException('Cart is empty');

    let totalMoney = 0;
    let totalPointsSpent = 0;

    for (const item of cart.items) {
      if (item.paymentType === PaymentType.Points) {
        totalPointsSpent += item.pointsPrice * item.quantity;
      } else if (item.paymentType === PaymentType.Hybrid) {
        totalMoney += item.price * item.quantity;
        totalPointsSpent += item.pointsPrice * item.quantity;
      } else {
        totalMoney += item.price * item.quantity;
      }
    }

    // Validate + deduct loyalty points
    if (totalPointsSpent > 0) {
      await this.usersService.deductPoints(userId, totalPointsSpent);
    }

    // Deduct stock
    for (const item of cart.items) {
      await this.productsService.decrementStock(item.productId.toString(), item.quantity);
    }

    // Points earned = floor(totalMoney spent) — 1 point per $1
    const pointsEarned = Math.floor(totalMoney);
    if (pointsEarned > 0) {
      await this.usersService.addPoints(userId, pointsEarned);
    }

    // Create order
    const order = await this.orderModel.create({
      userId: new Types.ObjectId(userId),
      items: cart.items.map((i) => ({
        productId: i.productId,
        name: i.name,
        image: i.image,
        price: i.price,
        pointsPrice: i.pointsPrice,
        paymentType: i.paymentType,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
      })),
      totalMoney,
      totalPointsSpent,
      pointsEarned,
    });

    // Clear cart
    await this.cartService.clearCart(userId);

    return order;
  }

  /** Place an order directly from a client-supplied items array (no backend cart needed) */
  async placeOrderDirect(userId: string, items: OrderItemDto[], shippingAddress?: ShippingAddressDto, discount = 0): Promise<OrderDocument> {
    if (!items || items.length === 0) throw new BadRequestException('No items provided');

    const totalMoney = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const pointsEarned = Math.floor(totalMoney);

    if (pointsEarned > 0) {
      await this.usersService.addPoints(userId, pointsEarned);
    }

    // Decrement stock for items that include a real productId
    for (const item of items) {
      if (item.productId && /^[a-f\d]{24}$/i.test(item.productId)) {
        try {
          await this.productsService.decrementStock(item.productId, item.quantity);
        } catch {
          // skip if product not found (static/demo product)
        }
      }
    }

    const order = await this.orderModel.create({
      userId: new Types.ObjectId(userId),
      items: items.map((i) => ({
        productId: (i.productId && /^[a-f\d]{24}$/i.test(i.productId))
          ? new Types.ObjectId(i.productId)
          : new Types.ObjectId(),
        name: i.name,
        image: i.image ?? '',
        price: i.price,
        pointsPrice: 0,
        paymentType: PaymentType.Money,
        size: i.size ?? '',
        color: i.color ?? '',
        quantity: i.quantity,
      })),
      ...(shippingAddress ? { shippingAddress } : {}),
      totalMoney,
      totalPointsSpent: 0,
      pointsEarned,
      discount,
    });

    // Broadcast purchase notification and persist to DB
    await this.notificationsGateway.saveAndBroadcast(
      'purchase_made',
      'purchase',
      'New Purchase',
      `Someone just bought ${items[0]?.name ?? 'an item'}${items.length > 1 ? ` + ${items.length - 1} more items` : ''} ($${totalMoney.toFixed(2)})`,
      {
        orderId: (order._id as any).toString(),
        itemCount: items.length,
        totalMoney,
        firstItem: items[0]?.name ?? 'an item',
      },
    );

    return order;
  }

  async getMyOrders(userId: string): Promise<OrderDocument[]> {    return this.orderModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getOrderById(id: string, userId?: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id).populate('userId', 'name email').exec();
    if (!order) throw new NotFoundException('Order not found');
    if (userId) {
      const ownerId = (order.userId as any)?._id?.toString() ?? (order.userId as any)?.toString();
      if (ownerId !== userId) throw new NotFoundException('Order not found');
    }
    return order;
  }

  async getAllOrders(): Promise<OrderDocument[]> {
    return this.orderModel.find().sort({ createdAt: -1 }).populate('userId', 'name email').exec();
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<OrderDocument> {
    const order = await this.orderModel
      .findByIdAndUpdate(id, { status: dto.status }, { new: true })
      .exec();
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
