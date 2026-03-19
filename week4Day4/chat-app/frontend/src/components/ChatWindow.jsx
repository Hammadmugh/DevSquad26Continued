import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useGetMessagesQuery, useGetRoomsQuery } from "../store/chatApi";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

export default function ChatWindow() {
  const { activeRoom, typingUsers, roomUserCounts } = useSelector((s) => s.chat);
  const { data: messages = [], isLoading, isError } = useGetMessagesQuery(activeRoom);
  const { data: rooms = [] } = useGetRoomsQuery();
  const bottomRef = useRef(null);

  const currentRoom = rooms.find((r) => r.id === activeRoom);
  const onlineCount = roomUserCounts[activeRoom];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 h-full min-w-0">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 bg-white shrink-0">
        <div>
          <h2 className="font-semibold text-gray-800 text-base">
            # {currentRoom?.name ?? activeRoom}
          </h2>
          {currentRoom?.description && (
            <p className="text-xs text-gray-400 mt-0.5">{currentRoom.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
          {onlineCount != null ? `${onlineCount} online` : ""}
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 bg-gray-50">
        {isLoading && (
          <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
            Loading messages…
          </div>
        )}
        {isError && (
          <div className="flex items-center justify-center h-32 text-red-400 text-sm">
            Failed to load messages.
          </div>
        )}
        {!isLoading && !isError && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400 text-sm gap-2">
            <span className="text-3xl">👋</span>
            <span>No messages yet. Be the first to say hi!</span>
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1 ml-1">
            <span className="flex gap-0.5">
              <span className="animate-bounce [animation-delay:0ms]">•</span>
              <span className="animate-bounce [animation-delay:150ms]">•</span>
              <span className="animate-bounce [animation-delay:300ms]">•</span>
            </span>
            <span>
              {typingUsers.length === 1
                ? `${typingUsers[0]} is typing…`
                : `${typingUsers.join(", ")} are typing…`}
            </span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput />
    </div>
  );
}
