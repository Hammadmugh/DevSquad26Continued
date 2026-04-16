// components/CommentCard.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { commentAPI, likeAPI } from '../lib/api';
import { useAuthStore } from '../lib/store';
import { emit } from '../lib/socket';

interface Comment {
  _id: string;
  author: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  content: string;
  likes: number;
  likedBy: string[];
  replies: any[];
  createdAt: string;
}

export default function CommentCard({ comment }: { comment: Comment }) {
  const user = useAuthStore((state) => state.user);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isLiked, setIsLiked] = useState(
    comment.likedBy?.includes(user?.id || '') || false
  );
  const [likes, setLikes] = useState(comment.likes);
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await likeAPI.unlike(comment._id);
        setLikes(Math.max(0, likes - 1));
      } else {
        await likeAPI.like(comment._id);
        setLikes(likes + 1);
      }
      setIsLiked(!isLiked);

      emit('comment:liked', {
        commentId: comment._id,
        authorId: comment.author?._id,
        authorUsername: comment.author?.username || 'Unknown',
        userId: user?.id,
        likes: isLiked ? likes - 1 : likes + 1,
      });
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    setIsLoading(true);

    try {
      const resp = await commentAPI.addReply(comment._id, replyContent);
      setReplies(resp.data.replies);
      setReplyContent('');
      setShowReplyForm(false);

      emit('comment:reply', {
        commentId: comment._id,
        authorId: comment.author?._id,
        userId: user?.id,
        authorUsername: comment.author?.username || 'Unknown',
        repliesCount: resp.data.replies.length,
      });
    } catch (error) {
      console.error('Failed to add reply:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this comment?')) {
      try {
        await commentAPI.delete(comment._id);
        window.location.reload();
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-fadeIn">
      {/* Comment Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            {comment.author?.username?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            {comment.author?._id ? (
              <Link
                href={`/users/${comment.author._id}`}
                className="font-semibold text-gray-900 truncate hover:text-blue-600 transition block"
              >
                {comment.author.username || 'Unknown User'}
              </Link>
            ) : (
              <p className="font-semibold text-gray-900 truncate">Unknown User</p>
            )}
            <p className="text-xs text-gray-500">
              {formatDate(comment.createdAt)}
            </p>
          </div>
        </div>
        {user?.id === comment.author?._id && (
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Delete
          </button>
        )}
      </div>

      {/* Comment Content */}
      <p className="text-gray-700 mb-4 break-words">{comment.content}</p>

      {/* Comment Actions */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
            isLiked
              ? 'bg-red-100 text-red-600'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <span>❤️</span>
          <span>{likes}</span>
        </button>

        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition text-gray-700"
        >
          <span>💬</span>
          <span>Reply {replies.length > 0 && `(${replies.length})`}</span>
        </button>

        {replies.length > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {showReplies ? '← Hide' : 'Show →'} Replies
          </button>
        )}
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            disabled={isLoading}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setShowReplyForm(false);
                setReplyContent('');
              }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleReply}
              disabled={isLoading || !replyContent.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition text-sm"
            >
              {isLoading ? 'Posting...' : 'Post Reply'}
            </button>
          </div>
        </div>
      )}

      {/* Replies Section */}
      {showReplies && replies.length > 0 && (
        <div className="mt-6 space-y-4 border-t pt-4">
          <p className="text-sm font-medium text-gray-600 mb-4">
            Replies ({replies.length})
          </p>
          {replies.map((reply: any, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {reply.author?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">
                    {reply.author?.username || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {reply.createdAt && formatDate(reply.createdAt)}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 text-sm break-words">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
