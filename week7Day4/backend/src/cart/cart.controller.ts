import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItem } from './cart.types';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  getCart() {
    return this.cartService.getCart();
  }

  @Post('add')
  addItem(
    @Body()
    body: Omit<CartItem, 'quantity'> & { quantity?: number },
  ) {
    return this.cartService.addItem(body);
  }

  @Put(':productId')
  updateItem(
    @Param('productId') productId: string,
    @Body() body: { quantity: number },
  ) {
    return this.cartService.updateItem(productId, body.quantity);
  }

  @Delete(':productId')
  removeItem(@Param('productId') productId: string) {
    return this.cartService.removeItem(productId);
  }
}
