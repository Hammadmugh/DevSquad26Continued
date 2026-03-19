import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://chat-app-backend-beige-alpha.vercel.app/api" }),
  tagTypes: ["Messages"],
  endpoints: (builder) => ({
    // GET /api/rooms
    getRooms: builder.query({
      query: () => "/rooms",
    }),

    // GET /api/messages/:roomId
    getMessages: builder.query({
      query: (roomId) => `/messages/${roomId}`,
      providesTags: (result, error, roomId) => [{ type: "Messages", id: roomId }],
    }),

    // DELETE /api/messages/:roomId/:messageId
    deleteMessage: builder.mutation({
      query: ({ roomId, messageId, username }) => ({
        url: `/messages/${roomId}/${messageId}`,
        method: "DELETE",
        body: { username },
      }),
      async onQueryStarted({ roomId, messageId }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            chatApi.util.updateQueryData("getMessages", roomId, (draft) => {
              const idx = draft.findIndex((m) => m.id === messageId);
              if (idx !== -1) draft.splice(idx, 1);
            })
          );
        } catch {
          // DELETE failed — do nothing
        }
      },
    }),

    // POST /api/messages
    sendMessage: builder.mutation({
      query: (body) => ({
        url: "/messages",
        method: "POST",
        body,
      }),
      // Immediately add the returned message to the cache so the sender
      // always sees it — regardless of whether the socket has joined the room.
      // The socket handler's duplicate check prevents double-rendering for others.
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          const { data: newMessage } = await queryFulfilled;
          dispatch(
            chatApi.util.updateQueryData("getMessages", body.roomId, (draft) => {
              const exists = draft.some((m) => m.id === newMessage.id);
              if (!exists) draft.push(newMessage);
            })
          );
        } catch {
          // POST failed — nothing to add
        }
      },
    }),
  }),
});

export const {
  useGetRoomsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useDeleteMessageMutation,
} = chatApi;
