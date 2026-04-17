import { Injectable } from '@nestjs/common';
import { Cart, CartItem } from './cart.types';

@Injectable()
export class CartService {
  // In-memory cart store (session-level simplification)
  private cart: Cart = { items: [], total: 0 };

  getCart(): Cart {
    return this.cart;
  }

  addItem(item: Omit<CartItem, 'quantity'> & { quantity?: number }): Cart {
    const existing = this.cart.items.find(
      (i) => i.productId === item.productId,
    );
    if (existing) {
      existing.quantity += item.quantity ?? 1;
    } else {
      this.cart.items.push({ ...item, quantity: item.quantity ?? 1 });
    }
    this.recalculate();
    return this.cart;
  }

  updateItem(productId: string, quantity: number): Cart {
    const existing = this.cart.items.find((i) => i.productId === productId);
    if (existing) {
      if (quantity <= 0) {
        this.cart.items = this.cart.items.filter(
          (i) => i.productId !== productId,
        );
      } else {
        existing.quantity = quantity;
      }
    }
    this.recalculate();
    return this.cart;
  }

  removeItem(productId: string): Cart {
    this.cart.items = this.cart.items.filter(
      (i) => i.productId !== productId,
    );
    this.recalculate();
    return this.cart;
  }

  private recalculate() {
    this.cart.total = this.cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }
}
