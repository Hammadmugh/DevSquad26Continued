'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { followerAPI, userAPI } from '@/lib/api';
import Link from 'next/link';
import { use } from 'react';

interface User {
  _id: string;
  username: string;
  email: string;
  bio?: string;
  followerCount?: number;
  followingCount?: number;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function FollowingPage({ params }: PageProps) {
  const { id: userId } = use(params);
  const router = useRouter();
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetchFollowing();
  }, [userId]);

  const fetchFollowing = async () => {
    try {
      setLoading(true);

      // Fetch user info for display
      const userResp = await userAPI.getUser(userId);
      setUsername(userResp.data.username);

      // Fetch following
      const resp = await followerAPI.getFollowing(userId);
      setFollowing(resp.data.following || []);
    } catch (error) {
      console.error('Failed to fetch following:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            ← Back to home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            {username}'s Following
          </h1>
          <p className="text-gray-600 mt-2">
            {following.length} {following.length === 1 ? 'following' : 'following'}
          </p>
        </div>

        {/* Following List */}
        <div className="space-y-4">
          {following.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500 text-lg">Not following anyone yet</p>
            </div>
          ) : (
            following.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-lg shadow-md p-4 sm:p-6 flex items-center justify-between"
              >
                <Link
                  href={`/users/${user._id}`}
                  className="flex-1 hover:opacity-75 transition"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user.username}
                      </h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      {user.bio && (
                        <p className="text-sm text-gray-700 mt-1">
                          {user.bio.substring(0, 100)}
                          {user.bio.length > 100 ? '...' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
