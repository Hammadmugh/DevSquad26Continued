import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RawMaterial } from './rawMaterialsApi';
import { Product } from './productsApi';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface DashboardData {
  totalOrders: number;
  totalRevenue: number;
  lowStockCount: number;
  lowStockMaterials: RawMaterial[];
  topProducts: { name: string; totalSold: number }[];
  salesChart: { date: string; total: number }[];
  products: Product[];
}

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardData, void>({
      query: () => '/dashboard',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApi;
