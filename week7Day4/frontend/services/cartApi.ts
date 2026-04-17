import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    getCart: builder.query<Cart, void>({
      query: () => 'cart',
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<Cart, Omit<CartItem, 'quantity'> & { quantity?: number }>({
      query: (item) => ({
        url: 'cart/add',
        method: 'POST',
        body: item,
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation<Cart, { productId: string; quantity: number }>({
      query: ({ productId, quantity }) => ({
        url: `cart/${productId}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    removeCartItem: builder.mutation<Cart, string>({
      query: (productId) => ({
        url: `cart/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} = cartApi;
