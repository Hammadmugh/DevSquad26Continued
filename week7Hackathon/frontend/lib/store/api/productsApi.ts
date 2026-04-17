import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface RecipeIngredient {
  materialId: string | { _id: string; name: string; unit: string; quantity: number };
  quantity: number;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  recipe: RecipeIngredient[];
  isActive: boolean;
  availableQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  price: number;
  recipe: { materialId: string; quantity: number }[];
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['Product'],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => '/products',
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation<Product, CreateProductDto>({
      query: (body) => ({ url: '/products', method: 'POST', body }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<Product, { id: string; data: UpdateProductDto }>({
      query: ({ id, data }) => ({ url: `/products/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({ url: `/products/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
