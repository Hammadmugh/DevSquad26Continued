import { useSelector } from "react-redux";
import { useSocket } from "./socket/useSocket";
import UsernameModal from "./components/UsernameModal";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

function ChatLayout() {
  // Activates the Socket.IO connection & all real-time event handlers
  useSocket();

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">
      <Sidebar />
      <main className="flex flex-1 overflow-hidden">
        <ChatWindow />
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
