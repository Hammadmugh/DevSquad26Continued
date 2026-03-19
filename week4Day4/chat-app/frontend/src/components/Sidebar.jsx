import { useDispatch, useSelector } from "react-redux";
import { setActiveRoom } from "../store/chatSlice";
import { useGetRoomsQuery } from "../store/chatApi";

export default function Sidebar() {
  const dispatch = useDispatch();
  const { activeRoom, username, roomUserCounts } = useSelector((s) => s.chat);
  const { data: rooms = [], isLoading } = useGetRoomsQuery();

  return (
    <aside className="w-64 shrink-0 bg-indigo-900 text-white flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-4 border-b border-indigo-700">
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <span>💬</span> ChatApp
        </h1>
        <p className="text-indigo-300 text-xs mt-0.5 truncate">@{username}</p>
      </div>

      {/* Rooms */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="text-indigo-400 text-xs font-semibold uppercase px-2 mb-2 tracking-wider">
          Rooms
        </p>
        {isLoading ? (
          <p className="text-indigo-300 text-sm px-2">Loading...</p>
        ) : (
          rooms.map((room) => {
            const isActive = room.id === activeRoom;
            const count = roomUserCounts[room.id];
            return (
              <button
                key={room.id}
                onClick={() => dispatch(setActiveRoom(room.id))}
                className={`w-full text-left rounded-lg px-3 py-2.5 text-sm transition-colors flex items-center justify-between group ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-indigo-200 hover:bg-indigo-800"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">#</span>
                  <span className="font-medium">{room.name}</span>
                </span>
                {count != null && (
                  <span
                    className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-indigo-500 text-white" : "bg-indigo-700 text-indigo-200"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })
        )}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-indigo-700 text-indigo-400 text-xs">
        Real-time · RTK Query · Socket.IO
      </div>
    </aside>
  );
}
