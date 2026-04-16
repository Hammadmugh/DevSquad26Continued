import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const newsletterApi = createApi({
  reducerPath: 'newsletterApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/newsletter` }),
  endpoints: (builder) => ({
    subscribe: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: '/subscribe',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useSubscribeMutation } = newsletterApi;
