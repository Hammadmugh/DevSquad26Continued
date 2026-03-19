import { useSelector } from "react-redux";
import { useDeleteMessageMutation } from "../store/chatApi";

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessageBubble({ message }) {
  const { username } = useSelector((s) => s.chat);
  const isOwn = message.username === username;
  const [deleteMessage, { isLoading: isDeleting }] = useDeleteMessageMutation();

  const handleDelete = () => {
    deleteMessage({ roomId: message.roomId, messageId: message.id, username });
  };

  return (
    <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"} mb-3 group`}>
      {!isOwn && (
        <span className="text-xs text-gray-500 mb-1 ml-1 font-medium">{message.username}</span>
      )}
      <div className={`flex items-end gap-1.5 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
            isOwn
              ? "bg-indigo-600 text-white rounded-br-sm"
              : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
          }`}
        >
          {message.text}
        </div>
        {isOwn && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete message"
            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 disabled:opacity-30 p-1 shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
      <span className="text-[10px] text-gray-400 mt-1 mx-1">{formatTime(message.timestamp)}</span>
    </div>
  );
}
