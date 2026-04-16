'use client';

import { useState } from 'react';
import { Socket } from 'socket.io-client';

interface CommentFormProps {
  socket: Socket | null;
  onCommentSubmitted: () => void;
}

export default function CommentForm({
  socket,
  onCommentSubmitted,
}: CommentFormProps) {
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!socket || !author.trim() || !text.trim()) {
      return;
    }

    setIsSending(true);
    socket.emit('add_comment', { author: author.trim(), text: text.trim() });

    // Reset form
    setText('');
    onCommentSubmitted();
    setIsSending(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6"
    >
      <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
        Add a Comment
      </h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Your Name
          </label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            disabled={isSending}
          />
        </div>

        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
          >
            Comment
          </label>
          <textarea
            id="comment"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your comment here..."
            rows={3}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
            disabled={isSending}
          />
        </div>

        <button
          type="submit"
          disabled={isSending || !author.trim() || !text.trim() || !socket}
          className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 text-white font-medium rounded-lg transition disabled:cursor-not-allowed duration-200"
        >
          {isSending ? 'Submitting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
}
