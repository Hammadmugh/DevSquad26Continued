'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { userAPI, commentAPI, followerAPI } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import CommentCard from '@/components/CommentCard';
import Link from 'next/link';
import { use } from 'react';

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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function UserProfilePage({ params }: PageProps) {
  const { id: userId } = use(params);
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.user);
  const [profile, setProfile] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const profileResp = await userAPI.getUser(userId);
      setProfile(profileResp.data);
      setFollowers(profileResp.data.followerCount || 0);

      // Check if current user is following this user
      if (currentUser) {
        try {
          const followResp = await followerAPI.isFollowing(
            currentUser.id,
            userId
          );
          setIsFollowing(followResp.data.isFollowing || false);
        } catch (error) {
          setIsFollowing(false);
        }
      }

      // Fetch user's comments
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

  const handleFollowToggle = async () => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    try {
      if (isFollowing) {
        await followerAPI.unfollow(userId);
        setIsFollowing(false);
        setFollowers(followers - 1);
      } else {
        await followerAPI.follow(userId);
        setIsFollowing(true);
        setFollowers(followers + 1);
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
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
          <p className="text-xl text-gray-500">User not found</p>
          <Link
            href="/"
            className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === userId;

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
              <p className="text-gray-600 text-sm sm:text-base mb-4">
                {profile.email}
              </p>

              {/* Bio */}
              <p className="text-gray-700 mb-6 text-sm sm:text-base">
                {profile.bio || 'No bio added yet'}
              </p>

              {/* Follow Button (only for other users) */}
              {!isOwnProfile && (
                <button
                  onClick={handleFollowToggle}
                  className={`px-6 py-2 rounded-lg transition font-medium ${
                    isFollowing
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-6">
                <Link
                  href={`/followers/${profile._id}`}
                  className="text-center hover:opacity-75 transition"
                >
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {followers}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Followers
                  </p>
                </Link>
                <Link
                  href={`/following/${profile._id}`}
                  className="text-center hover:opacity-75 transition"
                >
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {profile.followingCount || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Following
                  </p>
                </Link>
                <div className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {comments.length}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Comments
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
            {profile.username}'s Comments
          </h2>

          {comments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No comments yet</p>
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
