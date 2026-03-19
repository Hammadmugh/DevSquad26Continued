import { useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { useSendMessageMutation } from "../store/chatApi";
import socket from "../socket/socket";

const TYPING_TIMEOUT = 2000;

export default function MessageInput() {
  const [text, setText] = useState("");
  const { username, activeRoom } = useSelector((s) => s.chat);
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const typingTimerRef = useRef(null);
  const isTypingRef = useRef(false);

  const emitStopTyping = useCallback(() => {
    socket.emit("stop_typing", { roomId: activeRoom, username });
    isTypingRef.current = false;
  }, [activeRoom, username]);

  const handleChange = (e) => {
    setText(e.target.value);

    if (!isTypingRef.current) {
      socket.emit("typing", { roomId: activeRoom, username });
      isTypingRef.current = true;
    }

    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(emitStopTyping, TYPING_TIMEOUT);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    clearTimeout(typingTimerRef.current);
    emitStopTyping();
    setText("");

    try {
      await sendMessage({ roomId: activeRoom, username, text: trimmed }).unwrap();
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 px-4 py-3 border-t border-gray-200 bg-white"
    >
      <input
        type="text"
        value={text}
        onChange={handleChange}
        placeholder={`Message #${activeRoom}…`}
        maxLength={500}
        className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-colors"
        autoFocus
      />
      <button
        type="submit"
        disabled={!text.trim() || isLoading}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full w-10 h-10 flex items-center justify-center shrink-0 transition-colors"
        aria-label="Send message"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
        </svg>
      </button>
    </form>
  );
}
