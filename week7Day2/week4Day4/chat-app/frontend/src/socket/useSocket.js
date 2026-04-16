import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "./socket";
import { chatApi } from "../store/chatApi";
import {
  addTypingUser,
  removeTypingUser,
  setRoomUserCount,
} from "../store/chatSlice";

/**
 * Connects Socket.IO and handles all real-time events for the active room.
 * Must be mounted once (in App) after username is set.
 */
export function useSocket() {
  const dispatch = useDispatch();
  const { username, activeRoom } = useSelector((s) => s.chat);
  const prevRoomRef = useRef(null);

  // Connect/disconnect based on whether we have a username
  useEffect(() => {
    if (!username) return;
    if (!socket.connected) socket.connect();
    return () => {
      if (socket.connected) socket.disconnect();
    };
  }, [username]);

  // Join / leave rooms as activeRoom changes
  useEffect(() => {
    if (!username || !socket.connected) return;

    if (prevRoomRef.current && prevRoomRef.current !== activeRoom) {
      socket.emit("leave_room", { roomId: prevRoomRef.current, username });
    }
    socket.emit("join_room", { roomId: activeRoom, username });
    prevRoomRef.current = activeRoom;
  }, [activeRoom, username]);

  // Global socket event listeners
  useEffect(() => {
    if (!username) return;

    const handleConnect = () => {
      // Join the active room once connected
      socket.emit("join_room", { roomId: activeRoom, username });
      prevRoomRef.current = activeRoom;
    };

    const handleReceiveMessage = (message) => {
      // Patch the RTK Query cache with the new message without a refetch
      dispatch(
        chatApi.util.updateQueryData("getMessages", message.roomId, (draft) => {
          // Avoid duplicates (message we sent already gets added optimistically)
          const exists = draft.some((m) => m.id === message.id);
          if (!exists) draft.push(message);
        })
      );
    };

    const handleUserTyping = ({ username: typingUser }) => {
      dispatch(addTypingUser({ username: typingUser }));
    };

    const handleUserStopTyping = ({ username: typingUser }) => {
      dispatch(removeTypingUser({ username: typingUser }));
    };

    const handleRoomUserCount = ({ roomId, count }) => {
      dispatch(setRoomUserCount({ roomId, count }));
    };

    const handleMessageDeleted = ({ roomId, messageId }) => {
      dispatch(
        chatApi.util.updateQueryData("getMessages", roomId, (draft) => {
          const idx = draft.findIndex((m) => m.id === messageId);
          if (idx !== -1) draft.splice(idx, 1);
        })
      );
    };

    socket.on("connect", handleConnect);
    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("user_typing", handleUserTyping);
    socket.on("user_stop_typing", handleUserStopTyping);
    socket.on("room_user_count", handleRoomUserCount);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_deleted", handleMessageDeleted);
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stop_typing", handleUserStopTyping);
      socket.off("room_user_count", handleRoomUserCount);
    };
  }, [username, activeRoom, dispatch]);
}
