'use client';

import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
}

interface CommentListProps {
  socket: Socket | null;
  comments: Comment[];
  isLoading: boolean;
}

export default function CommentList({
  socket,
  comments,
  isLoading,
}: CommentListProps) {
  return (
    <div className="w-full flex-1 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 max-h-96 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
        Comments ({comments.length})
      </h2>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!isLoading && comments.length === 0 && (
        <p className="text-center text-zinc-500 dark:text-zinc-400 py-8">
          No comments yet. Be the first to comment!
        </p>
      )}

      {!isLoading && comments.length > 0 && (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                  {comment.author}
                </p>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  {new Date(comment.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300 break-words">
                {comment.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
