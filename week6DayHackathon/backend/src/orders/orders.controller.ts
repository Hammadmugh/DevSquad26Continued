import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { UpdateOrderStatusDto, PlaceOrderDirectDto } from './dto/order.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /** POST /api/orders — place order (direct items in body, or fall back to cart) */
  @Post()
  placeOrder(@CurrentUser() user: any, @Body() dto: PlaceOrderDirectDto) {
    if (dto?.items?.length) {
      return this.ordersService.placeOrderDirect(user.sub, dto.items, dto.shippingAddress, dto.discount ?? 0);
    }
    return this.ordersService.placeOrder(user.sub);
  }

  /** GET /api/orders — my order history */
  @Get()
  getMyOrders(@CurrentUser() user: any) {
    return this.ordersService.getMyOrders(user.sub);
  }

  /** GET /api/orders/all — all orders (Admin+) */
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Get('all')
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  /** GET /api/orders/:id — single order */
  @Get(':id')
  getOrder(@CurrentUser() user: any, @Param('id') id: string) {
    // Admins can view any order; users only their own
    const isAdmin = [Role.Admin, Role.SuperAdmin].includes(user.role);
    return this.ordersService.getOrderById(id, isAdmin ? undefined : user.sub);
  }

  /** PATCH /api/orders/:id/status — Admin+ */
  @UseGuards(RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }
}
