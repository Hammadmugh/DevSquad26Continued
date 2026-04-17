import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  note: string;
  createdAt: string;
}

export interface CreateOrderDto {
  items: { productId: string; quantity: number }[];
  note?: string;
}

export interface OrderSummary {
  totalOrders: number;
  totalRevenue: number;
  topProducts: { name: string; totalSold: number }[];
}

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => '/orders',
      providesTags: ['Order'],
    }),
    getOrderSummary: builder.query<OrderSummary, void>({
      query: () => '/orders/summary',
      providesTags: ['Order'],
    }),
    createOrder: builder.mutation<Order, CreateOrderDto>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderSummaryQuery,
  useCreateOrderMutation,
} = ordersApi;
