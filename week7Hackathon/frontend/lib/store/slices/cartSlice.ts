import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../api/productsApi';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const existing = state.items.find(
        (i) => i.product._id === action.payload._id,
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
    },
    incrementItem(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.product._id === action.payload);
      if (item) item.quantity += 1;
    },
    decrementItem(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.product._id === action.payload);
      if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          state.items = state.items.filter(
            (i) => i.product._id !== action.payload,
          );
        }
      }
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.product._id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, incrementItem, decrementItem, removeFromCart, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
