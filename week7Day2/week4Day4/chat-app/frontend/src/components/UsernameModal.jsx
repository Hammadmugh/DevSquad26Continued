import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUsername } from "../store/chatSlice";

export default function UsernameModal() {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed.length >= 2) dispatch(setUsername(trimmed));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-4">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">💬</div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome to ChatApp</h1>
          <p className="text-gray-500 text-sm mt-1">Enter a username to get started</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Your username (min 2 chars)"
            maxLength={20}
            className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            autoFocus
          />
          <button
            type="submit"
            disabled={input.trim().length < 2}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
}
