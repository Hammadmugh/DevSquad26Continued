# Real-Time Comment System with NestJS, WebSockets & MongoDB

A complete real-time comment system built with NestJS backend and Next.js frontend, featuring JWT authentication, WebSocket support for live updates, and a responsive design.

## 🎯 Features

- **User Authentication**: JWT-based registration and login
- **Profiles**: User profiles with bio, followers/following
- **Comments**: Post, edit, and delete comments
- **Nested Replies**: Reply to comments with notifications
- **Likes**: Like/unlike comments with real-time updates
- **Followers**: Follow/unfollow users
- **Real-time Notifications**: WebSocket-powered instant notifications for:
  - New comments
  - Replies to your comments
  - Likes on your comments
  - New followers
- **Responsive Design**: Mobile-friendly UI
- **MongoDB**: Document database for data persistence
- **Socket.IO**: Real-time communication

## 📋 Project Structure

```
week5Day2/
├── backend/
│   ├── src/
│   │   ├── auth/          # JWT authentication & guards
│   │   ├── user/          # User management & profiles
│   │   ├── comment/       # Comments & replies
│   │   ├── likes/         # Like/unlike functionality
│   │   ├── followers/     # Follow/unfollow system
│   │   ├── notification/  # Notifications
│   │   ├── websocket-gateway/  # WebSocket setup
│   │   ├── main.ts
│   │   └── app.module.ts
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── login/         # Auth pages
    │   ├── register/
    │   ├── profile/       # User profile
    │   ├── page.tsx       # Home with comments
    │   └── globals.css    # Styles
    ├── lib/
    │   ├── api.ts         # API client
    │   ├── socket.ts      # Socket.IO client
    │   └── store.ts       # Zustand state management
    ├── components/
    │   ├── CommentCard.tsx
    │   └── NotificationCenter.tsx
    ├── .env.local
    └── package.json
```

## 🚀 Setup Instructions

### Backend Setup

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Configure MongoDB**
Update `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/comment-system
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRATION=7d
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3001
```

3. **Start MongoDB** (if using local MongoDB)
```bash
# On Windows
mongod

# On Mac/Linux
brew services start mongodb-community
```

4. **Run Backend**
```bash
npm run start:dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Configure Environment**
Update `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

3. **Run Frontend**
```bash
npm run dev
```

The frontend will run on `http://localhost:3001`

## 📦 API Endpoints

### Authentication

- `POST /auth/register` - Register new user
  ```json
  {
    "email": "user@example.com",
    "password": "password",
    "username": "username"
  }
  ```

- `POST /auth/login` - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "password"
  }
  ```

### Users

- `GET /users` - Get all users
- `GET /users/profile` - Get current user profile (requires auth)
- `GET /users/:id` - Get specific user
- `GET /users/username/:username` - Get user by username
- `PATCH /users/:id` - Update profile (requires auth)

### Comments

- `GET /comments` - Get all comments
- `POST /comments` - Create comment (requires auth)
  ```json
  {
    "content": "Comment text"
  }
  ```

- `GET /comments/:id` - Get specific comment
- `PATCH /comments/:id` - Update comment (requires auth)
- `DELETE /comments/:id` - Delete comment (requires auth)
- `POST /comments/:id/replies` - Add reply (requires auth)
  ```json
  {
    "content": "Reply text"
  }
  ```

- `GET /comments/:id/replies` - Get comment replies
- `POST /comments/:id/like` - Like comment (requires auth)
- `POST /comments/:id/unlike` - Unlike comment (requires auth)

### Likes

- `POST /likes` - Like comment (requires auth)
  ```json
  {
    "commentId": "comment_id"
  }
  ```

- `DELETE /likes/:commentId` - Unlike comment (requires auth)
- `GET /likes/:commentId` - Get comment likes
- `GET /likes/:commentId/is-liked` - Check if liked (requires auth)

### Followers

- `POST /followers/:userId/follow` - Follow user (requires auth)
- `DELETE /followers/:userId/unfollow` - Unfollow user (requires auth)
- `GET /followers/:userId/followers` - Get user followers
- `GET /followers/:userId/following` - Get user following list
- `GET /followers/:userId/is-following/:targetId` - Check if following (requires auth)

### Notifications

- `GET /notifications` - Get all notifications (requires auth)
- `GET /notifications/unread` - Get unread notifications (requires auth)
- `GET /notifications/unread-count` - Get unread count (requires auth)
- `PATCH /notifications/:id/read` - Mark as read (requires auth)
- `PATCH /notifications/mark-all-read` - Mark all as read (requires auth)
- `DELETE /notifications/:id` - Delete notification (requires auth)
- `DELETE /notifications` - Delete all notifications (requires auth)

## 🔌 WebSocket Events

### Server Emits

- `connected` - Client successfully connected
- `users:online` - List of online users
- `users:offline` - List of online users (after someone disconnects)
- `comment:posted` - New comment posted
- `comment:updated` - Comment updated (likes, replies)
- `reply:added` - Reply added (only sent to comment author)
- `like:received` - Someone liked your comment (only sent to author)
- `follower:received` - Someone followed you (only sent to followed user)
- `notification:received` - New notification

### Client Emits

```javascript
// Post comment
socket.emit('comment:posted', {
  commentId: 'id',
  authorId: 'author_id',
  author: { username: 'name' },
  content: 'comment text'
});

// Add reply
socket.emit('comment:reply', {
  commentId: 'id',
  authorId: 'author_id',
  userId: 'user_id',
  repliesCount: 3
});

// Like comment
socket.emit('comment:liked', {
  commentId: 'id',
  authorId: 'author_id',
  userId: 'user_id',
  likes: 5
});

// Follow user
socket.emit('user:followed', {
  targetUserId: 'target_id',
  followerId: 'follower_id',
  followerUsername: 'username'
});
```

## 🎨 Frontend Features

### Login/Register Pages
- Form validation
- Error handling
- Auto-login on registration

### Home Page
- Create new comments
- View all comments with author info
- Like/unlike functionality
- Reply to comments
- Delete own comments
- Real-time updates via WebSockets
- Notification badge

### Profile Page
- View user profile with stats
- Edit bio
- View followers/following
- Follower counts

### Notification Center
- Real-time notification panel
- Mark as read
- Delete notifications
- Different notification types

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication:

1. User registers/logs in
2. Server returns JWT token
3. Token stored in `localStorage`
4. Token included in API requests via Authorization header
5. Token used for WebSocket authentication

## 📱 Responsive Design

The UI is fully responsive:
- Desktop (1200px+): Full layout
- Tablet (768px-1199px): Adjusted spacing
- Mobile (< 768px): Stacked layout, touch-friendly buttons

## 🗄️ Database Schema

### User
```
{
  email: string (unique)
  password: string (hashed)
  username: string (unique)
  bio: string
  profilePicture: string
  followers: [User._id]
  following: [User._id]
  followerCount: number
  followingCount: number
  createdAt: Date
  updatedAt: Date
}
```

### Comment
```
{
  author: User._id
  content: string
  likes: number
  likedBy: [User._id]
  replies: [Reply]
    - author: User._id
    - content: string
    - likes: number
    - likedBy: [User._id]
    - createdAt: Date
  createdAt: Date
  updatedAt: Date
}
```

### Notification
```
{
  recipient: User._id
  sender: User._id
  type: enum('COMMENT', 'REPLY', 'LIKE', 'FOLLOW')
  message: string
  commentId: Comment._id (optional)
  read: boolean
  createdAt: Date
}
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify network connectivity

### WebSocket Connection Failed
- Check FRONTEND_URL in backend .env
- Ensure both frontend and backend ports are correct
- Check browser console for CORS errors

### Authentication Issues
- Clear localStorage and try logging in again
- Check JWT_SECRET is set in .env
- Verify token hasn't expired

### API Request Errors
- Check backend server is running
- Verify NEXT_PUBLIC_API_URL in frontend .env.local
- Check API endpoint paths match backend routes

## 📚 Technologies Used

**Backend:**
- NestJS - Node.js framework
- MongoDB - NoSQL database
- Mongoose - MongoDB ODM
- JWT - Authentication
- Socket.IO - Real-time communication
- Passport - Authentication middleware
- bcryptjs - Password hashing

**Frontend:**
- Next.js - React framework
- TypeScript - Type safety
- Zustand - State management
- Socket.IO Client - Real-time client
- Axios - HTTP client
- CSS - Custom styling

## 🚀 Deployment

### Backend Deployment (Render/Heroku)
1. Set environment variables on hosting platform
2. Connect MongoDB Atlas
3. Deploy from GitHub

### Frontend Deployment (Vercel)
1. Connect GitHub repository
2. Set NEXT_PUBLIC_API_URL environment variable
3. Deploy automatically

## 📝 License

MIT License - feel free to use this project for learning

## 👨‍💻 Author

Created as a comprehensive real-time application example combining modern web technologies.

---

**Happy Coding!** 🎉
