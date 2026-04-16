# Real-time Comment System

A modern real-time comment system built with **Next.js**, **NestJS**, and **Socket.IO**. All users connected to the system see new comments instantly with live notifications.

## 🎯 Features

- ✅ **Real-time Comment Updates** - Comments appear instantly across all connected clients
- ✅ **Toast Notifications** - Get notified when other users post comments
- ✅ **Connection Status** - Live indicator showing server connection status
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- ✅ **Dark Mode Support** - Beautiful dark mode for comfortable viewing
- ✅ **In-Memory Storage** - Comments stored in memory (refresh to clear)
- ✅ **Auto-Reconnection** - Automatic reconnection with exponential backoff
- ✅ **Graceful Disconnection Handling** - User-friendly error messages

## 🏗️ Architecture

### Backend (NestJS + Socket.IO)
- **Location**: `/backend`
- **Port**: 3000 (default)
- **Features**:
  - WebSocket Gateway for real-time communication
  - Comment Service for managing comments
  - CORS enabled for cross-origin requests
  - Automatic client tracking for connection/disconnection

### Frontend (Next.js + React)
- **Location**: `/frontend`
- **Port**: 3001 (default for Next.js dev server)
- **Features**:
  - Custom `useSocket` hook for Socket.IO integration
  - Responsive Comment Form component
  - Live Comment List component
  - Dynamic toast notifications with `react-hot-toast`
  - Tailwind CSS for styling

## 📋 Project Structure

```
week5Day1/
├── backend/
│   ├── src/
│   │   ├── main.ts                 # NestJS bootstrap
│   │   ├── app.module.ts           # Root application module
│   │   ├── comments.gateway.ts     # WebSocket gateway
│   │   ├── comments.service.ts     # Business logic for comments
│   │   ├── app.controller.ts       # HTTP controller
│   │   └── app.service.ts          # App service
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx                # Main page
│   │   ├── layout.tsx              # Root layout
│   │   ├── globals.css             # Global styles
│   │   ├── components/
│   │   │   ├── CommentForm.tsx     # Comment form component
│   │   │   └── CommentList.tsx     # Comment list component
│   │   └── hooks/
│   │       └── useSocket.ts        # Socket.IO custom hook
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── .env.local
│
├── .env
├── README.md
└── SETUP_GUIDE.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Two terminal windows (one for backend, one for frontend)

### Installation & Running

#### 1. **Setup Backend**
```bash
cd backend
npm install
```

#### 2. **Run Backend**
```bash
npm run start:dev
```
You should see:
```
[Nest] 12345  - 03/30/2026, 10:00:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 03/30/2026, 10:00:00 AM     LOG [InstanceLoader] AppModule dependencies initialized
Server running on port 3000
```

#### 3. **Setup Frontend** (in a new terminal)
```bash
cd frontend
npm install
```

#### 4. **Run Frontend**
```bash
npm run dev
```
You should see:
```
  ▲ Next.js 16.2.1
  - Local:        http://localhost:3000
```

#### 5. **Open in Browser**
```
http://localhost:3000
```

## 💬 How to Use

1. **Enter Your Name**: Type your name in the "Your Name" field
2. **Write a Comment**: Type your comment in the comment box
3. **Post**: Click "Post Comment" button
4. **See Real-time Updates**: 
   - Your comment appears immediately
   - All other connected users see it too
   - Toast notification appears for new comments from others

5. **Test with Multiple Tabs**: 
   - Open another tab with the same URL
   - Post comments from one tab and see them appear in the other

## 📡 Socket.IO Events

### Server Events (Emitted to Clients)
- **`load_comments`** - Sends existing comments when a new client connects
- **`new_comment`** - Broadcasts new comment to all clients except sender
- **`comment_added`** - Confirms comment to the sender

### Client Events (Sent to Server)
- **`add_comment`** - Submits a new comment with `{ author, text }` payload

## 🔧 Configuration

### Environment Variables

**Backend** (`.env`):
```
PORT=3000
NODE_ENV=development
```

**Frontend** (`.env.local`):
```
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

### Changing Ports

**Backend**: Edit `package.json` start script or use:
```bash
PORT=3001 npm run start:dev
```

**Frontend**: Uses port 3001 by default, change with:
```bash
npm run dev -- -p 3002
```

## 🧪 Testing

### Manual Testing Steps

1. **Single User Test**: 
   - Open the app in one browser tab
   - Post a comment, verify it appears

2. **Multi-User Test**:
   - Open two browser tabs/windows
   - From one, post a comment
   - Check that notification appears in the other
   - Verify comment appears in both

3. **Connection Test**:
   - Open the app and check the connection status indicator
   - Stop backend server and verify "Disconnected" message
   - Restart backend and verify auto-reconnection

## 🎨 Styling

The application uses:
- **Tailwind CSS** v4 for responsive design
- **Dark mode** support via Tailwind's dark mode class
- **Mobile-first** responsive approach
- **Tailwind CSS PostCSS** for optimized builds

### Responsive Breakpoints
- **Mobile**: Default (< 640px)
- **Tablet**: md: 640px - 1023px
- **Desktop**: lg: 1024px+

## 📦 Dependencies

### Backend
- `@nestjs/core` - Core NestJS framework
- `@nestjs/websockets` - WebSocket support
- `@nestjs/platform-socket.io` - Socket.IO adapter
- `socket.io` - Real-time bidirectional communication
- `typescript` - Language support

### Frontend
- `next` - React framework
- `react` & `react-dom` - UI library
- `socket.io-client` - Socket.IO client
- `react-hot-toast` - Notifications
- `tailwindcss` - CSS utility framework

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill the process using the port (Windows)
taskkill /PID <PID> /F

# Or use a different port
PORT=3001 npm run start:dev
```

### Frontend can't connect to backend
1. Check backend is running on the correct port
2. Verify `NEXT_PUBLIC_SOCKET_URL` in `.env.local`
3. Check browser console for connection errors
4. Ensure both are on same machine or correct IP

### Comments not updating
1. Check browser console for errors
2. Open DevTools Network tab and check WebSocket connection
3. Restart both frontend and backend

### Port already in use
```bash
# Windows
netstat -ano | findstr :3000

# macOS/Linux
lsof -i :3000
```

## 🚀 Deployment

### Deploy Backend (Heroku Example)
```bash
heroku create your-app-name
heroku config:set NODE_ENV=production
git push heroku main
```

### Deploy Frontend (Vercel)
```bash
npm install -g vercel
vercel
# Set NEXT_PUBLIC_SOCKET_URL to your backend URL
```

## 📚 Learn More

- [NestJS Documentation](https://docs.nestjs.com/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📝 License

MIT License - feel free to use this project for learning or production.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 💡 Future Enhancements

- [ ] Add MongoDB/PostgreSQL for persistent storage
- [ ] User authentication
- [ ] Edit/delete comments
- [ ] Comment threading/replies
- [ ] User avatars
- [ ] Typing indicators
- [ ] Message reactions/emojis
- [ ] User presence list
