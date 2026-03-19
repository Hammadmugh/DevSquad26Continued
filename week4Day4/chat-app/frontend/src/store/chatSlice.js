import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    username: "",
    activeRoom: "general",
    typingUsers: [], // [{ username }]
    roomUserCounts: {}, // { roomId: count }
  },
  reducers: {
    setUsername(state, action) {
      state.username = action.payload;
    },
    setActiveRoom(state, action) {
      state.activeRoom = action.payload;
      state.typingUsers = [];
    },
    addTypingUser(state, action) {
      const { username } = action.payload;
      if (!state.typingUsers.includes(username)) {
        state.typingUsers.push(username);
      }
    },
    removeTypingUser(state, action) {
      const { username } = action.payload;
      state.typingUsers = state.typingUsers.filter((u) => u !== username);
    },
    setRoomUserCount(state, action) {
      const { roomId, count } = action.payload;
      state.roomUserCounts[roomId] = count;
    },
  },
});

export const {
  setUsername,
  setActiveRoom,
  addTypingUser,
  removeTypingUser,
  setRoomUserCount,
} = chatSlice.actions;

export default chatSlice.reducer;
