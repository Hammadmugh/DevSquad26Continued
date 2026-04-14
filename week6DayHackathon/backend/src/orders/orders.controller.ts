import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req, Headers, RawBodyRequest, HttpCode } from '@nestjs/common';
import { Request } from 'express';
import { OrdersService } from './orders.service';
import { StripeService } from './stripe.service';
import { UpdateOrderStatusDto, PlaceOrderDirectDto, CreateStripeSessionDto } from './dto/order.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly stripeService: StripeService,
  ) {}

  // ─── Stripe Checkout ────────────────────────────────────────────────────────

  /** POST /api/orders/stripe/checkout — authenticated; creates Stripe session + pending order */
  @UseGuards(JwtAuthGuard)
  @Post('stripe/checkout')
  createStripeSession(@CurrentUser() user: any, @Body() dto: CreateStripeSessionDto) {
    return this.stripeService.createCheckoutSession(
      user.sub,
      dto.items,
      dto.shippingAddress,
      dto.discount ?? 0,
      dto.pointsRedeemed ?? 0,
    );
  }

  /** GET /api/orders/stripe/session/:sessionId — confirm payment status after redirect */
  @UseGuards(JwtAuthGuard)
  @Get('stripe/session/:sessionId')
  getSessionStatus(@Param('sessionId') sessionId: string) {
    return this.stripeService.getSessionStatus(sessionId);
  }

  /** POST /api/orders/stripe/webhook — Stripe webhook (no auth, raw body) */
  @Post('stripe/webhook')
  @HttpCode(200)
  async stripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    const payload = req.rawBody;
    if (!payload || !signature) return { received: false };

    let event: import('stripe').Stripe.Event;
    try {
      event = this.stripeService.constructEvent(payload, signature);
    } catch {
      return { received: false };
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as import('stripe').Stripe.Checkout.Session;
      await this.stripeService.fulfillOrder(session.id);
    }

    if (event.type === 'checkout.session.expired') {
      const session = event.data.object as import('stripe').Stripe.Checkout.Session;
      await this.stripeService.cancelOrder(session.id);
    }

    return { received: true };
  }

  // ─── Regular order endpoints ─────────────────────────────────────────────────

  /** POST /api/orders — place points-only / free order (no Stripe) */
  @UseGuards(JwtAuthGuard)
  @Post()
  placeOrder(@CurrentUser() user: any, @Body() dto: PlaceOrderDirectDto) {
    if (dto?.items?.length) {
      return this.ordersService.placeOrderDirect(
        user.sub,
        dto.items,
        dto.shippingAddress,
        dto.discount ?? 0,
        dto.pointsRedeemed ?? 0,
      );
    }
    return this.ordersService.placeOrder(user.sub);
  }

  /** GET /api/orders — my order history */
  @UseGuards(JwtAuthGuard)
  @Get()
  getMyOrders(@CurrentUser() user: any) {
    return this.ordersService.getMyOrders(user.sub);
  }

  /** GET /api/orders/all — all orders (Admin+) */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Get('all')
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  /** GET /api/orders/:id — single order */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOrder(@CurrentUser() user: any, @Param('id') id: string) {
    const isAdmin = [Role.Admin, Role.SuperAdmin].includes(user.role);
    return this.ordersService.getOrderById(id, isAdmin ? undefined : user.sub);
  }

  /** PATCH /api/orders/:id/status — Admin+ */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }
}
