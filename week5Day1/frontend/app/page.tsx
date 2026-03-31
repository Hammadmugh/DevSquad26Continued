'use client';

import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import CommentForm from './components/CommentForm';
import CommentList from './components/CommentList';
import { useSocket } from './hooks/useSocket';

export default function Home() {
  const { socket, comments, isLoading, isConnected } = useSocket();
  const [, setRefresh] = useState(0);

  const handleCommentSubmitted = () => {
    setRefresh((prev) => prev + 1);
  };

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
      <Toaster />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            Real-time Comments
          </h1>
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400">
          A real-time comment system built with Next.js, NestJS, and Socket.IO. Post your
          comment and see it appear instantly across all connected users!
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comment Form */}
        <div className="flex flex-col">
          <CommentForm socket={socket} onCommentSubmitted={handleCommentSubmitted} />
        </div>

        {/* Comment List */}
        <div className="flex flex-col">
          <CommentList socket={socket} comments={comments} isLoading={isLoading} />
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          💡 How it works
        </h3>
        <ul className="text-blue-800 dark:text-blue-200 space-y-1 text-sm">
          <li>• Type your name and comment in the form</li>
          <li>• Click "Post Comment" to submit</li>
          <li>• All connected users will see your comment instantly</li>
          <li>• Get a notification when others post comments</li>
          <li>• Comments are stored in memory (refresh to clear)</li>
        </ul>
      </div>
    </main>
  );
}
