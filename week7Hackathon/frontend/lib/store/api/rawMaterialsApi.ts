import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface RawMaterial {
  _id: string;
  name: string;
  unit: string;
  quantity: number;
  minStockLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRawMaterialDto {
  name: string;
  unit: string;
  quantity: number;
  minStockLevel?: number;
}

export interface UpdateRawMaterialDto extends Partial<CreateRawMaterialDto> {}

export const rawMaterialsApi = createApi({
  reducerPath: 'rawMaterialsApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ['RawMaterial'],
  endpoints: (builder) => ({
    getRawMaterials: builder.query<RawMaterial[], void>({
      query: () => '/raw-materials',
      providesTags: ['RawMaterial'],
    }),
    getLowStockMaterials: builder.query<RawMaterial[], void>({
      query: () => '/raw-materials/low-stock',
      providesTags: ['RawMaterial'],
    }),
    createRawMaterial: builder.mutation<RawMaterial, CreateRawMaterialDto>({
      query: (body) => ({ url: '/raw-materials', method: 'POST', body }),
      invalidatesTags: ['RawMaterial'],
    }),
    updateRawMaterial: builder.mutation<RawMaterial, { id: string; data: UpdateRawMaterialDto }>({
      query: ({ id, data }) => ({ url: `/raw-materials/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['RawMaterial'],
    }),
    deleteRawMaterial: builder.mutation<void, string>({
      query: (id) => ({ url: `/raw-materials/${id}`, method: 'DELETE' }),
      invalidatesTags: ['RawMaterial'],
    }),
  }),
});

export const {
  useGetRawMaterialsQuery,
  useGetLowStockMaterialsQuery,
  useCreateRawMaterialMutation,
  useUpdateRawMaterialMutation,
  useDeleteRawMaterialMutation,
} = rawMaterialsApi;
