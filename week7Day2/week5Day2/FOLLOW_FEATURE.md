# How Users Follow Each Other - Complete Flow

## Overview
Users can follow/unfollow other users through an interactive button on the user profile page.

---

## Step-by-Step Flow

### 1. **User Navigates to Another User's Profile**
- When viewing a comment, user clicks on the author's username
- Navigates to `/users/[userId]` (e.g., `/users/69cb90d317ec7a186bfc7ee0`)
- Example: [users/[id]/page.tsx](app/users/[id]/page.tsx)

### 2. **Profile Load & Follow Status Check**
```typescript
useEffect(() => {
  fetchProfile();
}, [userId]);

const fetchProfile = async () => {
  try {
    // Fetch the user's profile data
    const profileResp = await userAPI.getUser(userId);
    setProfile(profileResp.data);
    setFollowers(profileResp.data.followerCount || 0);

    // Check if current user is already following this user
    if (currentUser) {
      const followResp = await followerAPI.isFollowing(
        currentUser.id,
        userId
      );
      setIsFollowing(followResp.data.isFollowing || false);
    }
    // ... load comments
  } catch (error) {
    console.error('Failed to fetch profile:', error);
  }
};
```

**What happens:**
- ✅ Loads the target user's profile information
- ✅ Gets follower count
- ✅ Checks if current user is already following this user
- ✅ Sets the follow button state (Follow / Following)

---

### 3. **UI Displays Follow Button**
```tsx
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
```

**Button states:**
- **Follow** (blue) - User is not following yet → Click to follow
- **Following** (gray) - User is already following → Click to unfollow
- Hidden if viewing own profile (isOwnProfile = true)

---

### 4. **User Clicks Follow/Unfollow Button**
```typescript
const handleFollowToggle = async () => {
  // Redirect to login if not authenticated
  if (!currentUser) {
    router.push('/login');
    return;
  }

  try {
    if (isFollowing) {
      // USER IS ALREADY FOLLOWING → UNFOLLOW
      await followerAPI.unfollow(userId);
      setIsFollowing(false);
      setFollowers(followers - 1);  // Update count
    } else {
      // USER IS NOT FOLLOWING → FOLLOW
      await followerAPI.follow(userId);
      setIsFollowing(true);
      setFollowers(followers + 1);  // Update count
    }
  } catch (error) {
    console.error('Failed to toggle follow:', error);
  }
};
```

---

### 5. **API Calls Made**

#### Follow API
```typescript
// file: lib/api.ts
export const followerAPI = {
  follow: (userId: string) =>
    apiClient.post(`/followers/${userId}/follow`),
  
  unfollow: (userId: string) =>
    apiClient.delete(`/followers/${userId}/unfollow`),
  
  isFollowing: (userId: string, targetId: string) =>
    apiClient.get(`/followers/${userId}/is-following/${targetId}`),
  
  getFollowers: (userId: string) =>
    apiClient.get(`/followers/${userId}/followers`),
  
  getFollowing: (userId: string) =>
    apiClient.get(`/followers/${userId}/following`),
};
```

---

### 6. **Backend Endpoints**

#### POST /followers/:userId/follow
**Purpose:** Create a follow relationship

**Request:**
```
POST http://localhost:3000/followers/69cb90d317ec7a186bfc7ee0/follow
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "message": "Successfully followed user",
  "follower": { "id": "69cb90d317ec7a186bfc7ee0" }
}
```

**Reference:** [followers.controller.ts](backend/src/followers/followers.controller.ts)

---

#### DELETE /followers/:userId/unfollow
**Purpose:** Remove a follow relationship

**Request:**
```
DELETE http://localhost:3000/followers/69cb90d317ec7a186bfc7ee0/unfollow
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "message": "Successfully unfollowed user"
}
```

---

#### GET /followers/:userId/is-following/:targetId
**Purpose:** Check if user A is following user B

**Request:**
```
GET http://localhost:3000/followers/userA_id/is-following/userB_id
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
  "isFollowing": true
}
```

---

## Complete User Journey Example

### Scenario: User A wants to follow User B

1. **User A on Home Page**
   - Sees comment posted by User B
   - Clicks on User B's username

2. **Navigation**
   - Frontend navigates to `/users/userB_id`
   - User B's profile page loads

3. **Initial Load**
   - Page fetches User B's profile data
   - Page checks if User A is following User B
   - Follow button shows "Follow" (User A not following yet)

4. **User A Clicks "Follow"**
   - `handleFollowToggle()` is called
   - Frontend sends: `POST /followers/userB_id/follow`
   - Backend creates follow relationship in database

5. **Success Update**
   ```typescript
   setIsFollowing(true);        // Update local state
   setFollowers(followers + 1); // Update follower count +1
   ```
   - Button changes to "Following" (gray)
   - Follower count increases by 1

6. **Real-time Notification (Optional)**
   - WebSocket emits "user:followed" event
   - User B receives notification: "User A followed you"

---

## Data Flow Diagram

```
┌─────────────────┐
│  User A clicks  │
│  "Follow" btn   │
└────────┬────────┘
         │
         ▼
┌──────────────────────────┐
│  handleFollowToggle()     │
│  checks if following      │
└────────┬─────────────────┘
         │
         ├─ If YES → await followerAPI.unfollow(userId)
         │
         └─ If NO  → await followerAPI.follow(userId)
                     
                     ▼
         ┌──────────────────────────┐
         │  POST /followers/:id/follow
         │  with JWT token          │
         └──────────┬───────────────┘
                    │
                    ▼
         ┌──────────────────────────┐
         │  Backend creates follow   │
         │  relationship in DB       │
         └──────────┬───────────────┘
                    │
                    ▼
         ┌──────────────────────────┐
         │  Frontend updates state:  │
         │  - setIsFollowing(true)   │
         │  - setFollowers(+1)       │
         └──────────┬───────────────┘
                    │
                    ▼
         ┌──────────────────────────┐
         │  Button changes to        │
         │  "Following" state        │
         └──────────────────────────┘
```

---

## Related Features

### View Followers/Following Lists
- Click on **"Followers"** count → `/followers/[userId]/page.tsx`
- Click on **"Following"** count → `/following/[userId]/page.tsx`

### Notifications
- When User B gets a follower, they receive notification (if implemented)
- WebSocket event: `"user:followed"`

### Profile Stats
```
Followers: 5 (clickable)
Following: 3 (clickable)
Comments: 12
```

---

## File References

**Frontend:**
- Page: [app/users/[id]/page.tsx](app/users/[id]/page.tsx)
- API: [lib/api.ts](lib/api.ts#L64-L82)
- Components: Followers list in [app/followers/[id]/page.tsx](app/followers/[id]/page.tsx)

**Backend:**
- Controller: [backend/src/followers/followers.controller.ts](backend/src/followers/followers.controller.ts)
- Service: [backend/src/followers/followers.service.ts](backend/src/followers/followers.service.ts)
- Guard: [backend/src/auth/decorators/auth.decorator.ts](backend/src/auth/decorators/auth.decorator.ts)

---

## Security Features

✅ **JWT Authentication Required**
- Must be logged in to follow users
- Non-authenticated users redirected to `/login`

✅ **Token Validation**
- Middleware extracts and validates JWT
- Only allows authenticated users to follow/unfollow

✅ **User Verification**
- Backend validates that user IDs exist
- Prevents duplicate follow relationships

---

## Key Points

1. **Follow button only shows for other users** - Not visible on own profile
2. **Click to toggle** - Same button for follow/unfollow
3. **Instant UI update** - Doesn't require page refresh
4. **Live follower count** - Updates immediately when you follow/unfollow
5. **Protected endpoints** - Requires JWT authentication
6. **Real-time ready** - WebSocket can notify followers of new follow events
