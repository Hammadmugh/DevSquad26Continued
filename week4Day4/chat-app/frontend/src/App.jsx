import { useState } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "./socket/useSocket";
import UsernameModal from "./components/UsernameModal";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

function ChatLayout() {
  // Activates the Socket.IO connection & all real-time event handlers
  useSocket();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed overlay on mobile, static on md+ */}
      <div
        className={`fixed inset-y-0 left-0 z-30 transition-transform duration-200 ease-in-out md:relative md:z-auto md:translate-x-0 md:flex md:shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onRoomSelect={() => setSidebarOpen(false)} />
      </div>

      <main className="flex flex-1 overflow-hidden min-w-0">
        <ChatWindow onMenuClick={() => setSidebarOpen(true)} />
      </main>
    </div>
  );
}

export default function App() {
  const username = useSelector((s) => s.chat.username);

  return (
    <>
      {!username && <UsernameModal />}
      <ChatLayout />
    </>
  );
}
