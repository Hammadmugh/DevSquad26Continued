'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { commentAPI } from '../lib/api';
import { useAuthStore, useCommentStore } from '../lib/store';
import { initSocket, off, on, emit } from '../lib/socket';
import CommentCard from '../components/CommentCard';
import NotificationCenter from '../components/NotificationCenter';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const comments = useCommentStore((state) => state.comments);
  const setComments = useCommentStore((state) => state.setComments);
  const addComment = useCommentStore((state) => state.addComment);
  
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (!storedToken && !token) {
      router.push('/login');
      return;
    }
    setMounted(true);
  }, [router, token]);

  // Initialize socket only when authenticated
  useEffect(() => {
    if (mounted && token) {
      initSocket(token);
    }
  }, [token, mounted]);

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    const handleCommentPosted = () => {
      fetchComments();
    };

    on('comment:posted', handleCommentPosted);

    return () => {
      off('comment:posted', handleCommentPosted);
    };
  }, []);

  const fetchComments = async () => {
    try {
      const resp = await commentAPI.getAll();
      setComments(resp.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const resp = await commentAPI.create(newComment);
      addComment(resp.data);
      setNewComment('');

      emit('comment:posted', {
        commentId: resp.data._id,
        authorId: user?.id,
        author: { username: user?.username },
        content: newComment,
      });
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-20">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">📝</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Comment System
          </h1>
          <p className="text-gray-600 mb-8">
            Sign up or log in to start commenting and engaging with others!
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/register"
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Create Account
            </Link>
            <Link
              href="/login"
              className="w-full px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* User Info & Create Comment Section */}
        {user && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-900 truncate">{user.username}</h2>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
              <Link
                href={`/users/${user.id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap text-sm"
              >
                View Profile
              </Link>
            </div>

            {/* Comment Form */}
            <form onSubmit={handlePostComment} className="space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="What's on your mind? Share a comment..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-black focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
                disabled={loading}
              />
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewComment('')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={loading || !newComment.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition text-sm"
                >
                  {loading ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Comments Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-600 rounded"></span>
            Comments ({comments.length})
          </h3>

          {fetchLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : comments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">
                No comments yet. Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentCard key={comment._id} comment={comment} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
