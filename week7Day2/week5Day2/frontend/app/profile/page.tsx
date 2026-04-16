'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { userAPI, commentAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import CommentCard from '@/components/CommentCard';
import Link from 'next/link';

interface User {
  _id: string;
  username: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  followerCount: number;
  followingCount: number;
}

interface Comment {
  _id: string;
  author: any;
  content: string;
  likes: number;
  likedBy: string[];
  replies: any[];
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [profile, setProfile] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileResp = await userAPI.getProfile();
      setProfile(profileResp.data);
      setBio(profileResp.data.bio || '');

      // Fetch all comments and filter by current user
      const commentsResp = await commentAPI.getAll();
      const userComments = commentsResp.data.filter(
        (c: Comment) => c.author._id === profileResp.data._id
      );
      setComments(userComments);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profile) return;
    try {
      const resp = await userAPI.updateProfile(profile._id, { bio });
      setProfile(resp.data);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xl text-gray-500">Profile not found</p>
          <Link href="/" className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl sm:text-5xl font-bold shadow-lg">
                {profile.username?.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                {profile.username}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base mb-4">{profile.email}</p>

              {/* Bio Section */}
              <div className="mb-6">
                {!editing ? (
                  <div>
                    <p className="text-gray-700 mb-3 text-sm sm:text-base">
                      {profile.bio || 'No bio added yet'}
                    </p>
                    <button
                      onClick={() => setEditing(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                    >
                      Edit Bio
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateProfile}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditing(false);
                          setBio(profile.bio || '');
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                <Link
                  href={`/followers/${profile._id}`}
                  className="text-center hover:opacity-75 transition"
                >
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {profile.followerCount || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">Followers</p>
                </Link>
                <Link
                  href={`/following/${profile._id}`}
                  className="text-center hover:opacity-75 transition"
                >
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {profile.followingCount || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">Following</p>
                </Link>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {comments.length}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">Comments</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            My Comments
          </h2>

          {comments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No comments yet</p>
              <p className="text-gray-400 text-sm mt-2">Start commenting to see them here</p>
              <Link
                href="/"
                className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Go to feed
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentCard key={comment._id} comment={comment} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
