import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument, OrderStatus, PaymentMethod, PaymentStatus } from './schemas/order.schema';
import { UsersService } from '../users/users.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { OrderItemDto, ShippingAddressDto } from './dto/order.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(
    private configService: ConfigService,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private usersService: UsersService,
    private productsService: ProductsService,
    private notificationsGateway: NotificationsGateway,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY', ''),
      { apiVersion: '2024-06-20' },
    );
  }

  /**
   * Creates a Stripe Checkout session and a pending order.
   * Returns the Stripe checkout URL.
   */
  async createCheckoutSession(
    userId: string,
    items: OrderItemDto[],
    shippingAddress: ShippingAddressDto | undefined,
    discount: number,
    pointsRedeemed: number,
  ): Promise<{ url: string; orderId: string }> {
    if (!items.length) throw new BadRequestException('No items provided');

    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    // totalMoney is what will actually be charged via Stripe (after discounts/points deduction)
    const DELIVERY_FEE = 15;
    const totalMoney = Math.max(0, subtotal - discount + DELIVERY_FEE);

    // Build Stripe line items — one line per cart item
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          ...(item.image ? { images: [item.image] } : {}),
        },
        unit_amount: Math.round(item.price * 100), // cents
      },
      quantity: item.quantity,
    }));

    // Add delivery as a separate line item
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: { name: 'Delivery Fee' },
        unit_amount: DELIVERY_FEE * 100,
      },
      quantity: 1,
    });

    // If discount > 0, add a negative coupon line item
    if (discount > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: `Discount` },
          unit_amount: -Math.round(discount * 100),
        },
        quantity: 1,
      });
    }

    // Create a pending order first so we have an ID to attach to the session
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
        size: i.size ?? '',
        color: i.color ?? '',
        quantity: i.quantity,
      })),
      ...(shippingAddress ? { shippingAddress } : {}),
      totalMoney,
      totalPointsSpent: pointsRedeemed,
      discount,
      status: OrderStatus.Pending,
      paymentMethod: PaymentMethod.Stripe,
      paymentStatus: PaymentStatus.Pending,
    });

    const orderId = (order._id as any).toString();

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${frontendUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/checkout?cancelled=true`,
      metadata: {
        orderId,
        userId,
        pointsRedeemed: String(pointsRedeemed),
      },
    });

    // Attach session id to order
    await this.orderModel.findByIdAndUpdate(orderId, { stripeSessionId: session.id });

    return { url: session.url!, orderId };
  }

  /**
   * Called by the webhook when payment_intent.succeeded fires.
   * Fulfils the order: marks paid, deducts points, adds earned points, decrements stock.
   */
  async fulfillOrder(sessionId: string): Promise<void> {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') return;

    const { orderId, userId, pointsRedeemed } = session.metadata ?? {};
    if (!orderId) return;

    const order = await this.orderModel.findById(orderId);
    if (!order || order.paymentStatus === PaymentStatus.Paid) return; // idempotent

    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : (session.payment_intent as any)?.id;

    // Deduct redeemed points if any
    const pts = parseInt(pointsRedeemed ?? '0', 10);
    if (pts > 0 && userId) {
      try { await this.usersService.deductPoints(userId, pts); } catch { /* ignore if already deducted */ }
    }

    // Decrement stock
    for (const item of order.items) {
      if (item.productId) {
        try { await this.productsService.decrementStock(item.productId.toString(), item.quantity); } catch { /**/ }
      }
    }

    // Award loyalty points (1 per $1 of money paid)
    const pointsEarned = Math.floor(order.totalMoney);
    if (pointsEarned > 0 && userId) {
      await this.usersService.addPoints(userId, pointsEarned);
    }

    await this.orderModel.findByIdAndUpdate(orderId, {
      status: OrderStatus.Paid,
      paymentStatus: PaymentStatus.Paid,
      stripePaymentIntentId: paymentIntentId ?? '',
      pointsEarned,
    });

    // Broadcast notification
    await this.notificationsGateway.saveAndBroadcast(
      'purchase_made',
      'purchase',
      'New Purchase',
      `Order #${orderId.slice(-6).toUpperCase()} paid ($${order.totalMoney.toFixed(2)})`,
      { orderId, totalMoney: order.totalMoney },
    );
  }

  /** Mark order as failed/cancelled */
  async cancelOrder(sessionId: string): Promise<void> {
    const order = await this.orderModel.findOne({ stripeSessionId: sessionId });
    if (!order) return;
    if (order.paymentStatus === PaymentStatus.Pending) {
      await this.orderModel.findByIdAndUpdate(order._id, {
        paymentStatus: PaymentStatus.Cancelled,
        status: OrderStatus.Cancelled,
      });
    }
  }

  /** Verify a Stripe webhook signature and parse the event */
  constructEvent(payload: Buffer, signature: string): Stripe.Event {
    const secret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET', '');
    return this.stripe.webhooks.constructEvent(payload, signature, secret);
  }

  /** Look up a checkout session (used by the success page to confirm) */
  async getSessionStatus(sessionId: string): Promise<{ status: string; orderId: string | null }> {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    return {
      status: session.payment_status,
      orderId: session.metadata?.orderId ?? null,
    };
  }
}
