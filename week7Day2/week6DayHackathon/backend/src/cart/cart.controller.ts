import {
  Controller, Get, Post, Patch, Delete, Param, Body, UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /** GET /api/cart */
  @Get()
  getCart(@CurrentUser() user: any) {
    return this.cartService.getCart(user.sub);
  }

  /** POST /api/cart */
  @Post()
  addItem(@CurrentUser() user: any, @Body() dto: AddToCartDto) {
    return this.cartService.addItem(user.sub, dto);
  }

  /** PATCH /api/cart/:itemId */
  @Patch(':itemId')
  updateItem(
    @CurrentUser() user: any,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(user.sub, itemId, dto);
  }

  /** DELETE /api/cart/:itemId */
  @Delete(':itemId')
  removeItem(@CurrentUser() user: any, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(user.sub, itemId);
  }

  /** DELETE /api/cart */
  @Delete()
  clearCart(@CurrentUser() user: any) {
    return this.cartService.clearCart(user.sub);
  }
}
