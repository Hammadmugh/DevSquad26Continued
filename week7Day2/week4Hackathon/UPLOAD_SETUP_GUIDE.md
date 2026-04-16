# Movie/Show Upload Feature - Setup Guide

## Overview
This guide walks you through setting up and using the new movie/show upload feature with Cloudinary integration.

## Components Created

### Frontend Components
1. **AdminUploadMovie.jsx** - Form component for uploading movies/shows with trailers
   - Location: `frontend/src/components/AdminUploadMovie.jsx`
   - Features: Multi-field form with drag-and-drop file upload
   - Max file size: 100MB

2. **VideoPlayer.jsx** - Video player for previewing trailers
   - Location: `frontend/src/components/VideoPlayer.jsx`
   - Features: Full screen support, standard controls, responsive

3. **AdminDashboard.jsx (Updated)** - Added "Upload Content" tab
   - Location: `frontend/src/pages/AdminDashboard.jsx`
   - New tab integrates AdminUploadMovie component

### Frontend Services
- **uploadService.js** - API abstraction for movie uploads
  - Location: `frontend/src/services/uploadService.js`
  - Method: `uploadMovie(movieData, trailerFile)`
  - Handles FormData encoding and authorization

### Backend Infrastructure
1. **uploadController.js** - Handles video uploads to Cloudinary
   - Location: `backend/src/controllers/uploadController.js`
   - Converts file buffers to streams for Cloudinary upload
   - Creates movie records in MongoDB

2. **uploadRoutes.js** - API endpoints for uploads
   - Location: `backend/src/routes/uploadRoutes.js`
   - Endpoint: POST `/api/upload/movie` (admin only)
   - Protected by adminMiddleware

3. **multer.js** - File upload configuration
   - Location: `backend/src/config/multer.js`
   - Memory storage (no disk I/O)
   - 100MB file size limit
   - Accepts video files

4. **cloudinary.js** - Cloudinary SDK initialization
   - Location: `backend/src/config/cloudinary.js`
   - Uses environment variables for configuration

## Setup Instructions

### Step 1: Cloudinary Account Setup
1. Create a free account at [https://cloudinary.com](https://cloudinary.com)
2. Go to Dashboard and copy your credentials:
   - Cloud Name
   - API Key
   - API Secret

### Step 2: Update Backend Environment Variables
1. Open `backend/.env`
2. Replace placeholder values with your Cloudinary credentials:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### Step 3: Verify Dependencies
Backend dependencies should already be installed. To verify:
```bash
cd backend
npm list cloudinary multer
```

### Step 4: Start the Servers
Terminal 1 - Backend:
```bash
cd backend
npm start
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

## Using the Upload Feature

### Step 1: Login as Admin
1. Go to http://localhost:5173
2. Login with admin credentials
3. The "Admin" button will appear in the navbar

### Step 2: Access Admin Dashboard
1. Click "Admin" button in navbar
2. Click "Upload Content" tab

### Step 3: Fill Form
Required fields:
- **Title**: Movie/Show name
- **Image URL**: Poster/thumbnail URL (external link)
- **Type**: Select "Movie" or "Show"

Optional fields:
- Director
- Year
- Rating (0-10)
- Duration (e.g., "2h 30min")
- Genres (comma-separated)
- Cast (comma-separated)
- Description

### Step 4: Upload Trailer
1. Click the dashed box to select video file or drag-and-drop
2. Supported formats: MP4, WebM, MOV
3. Max size: 100MB
4. File preview will show after selection

### Step 5: Submit
1. Click "Upload Movie/Show" button
2. Wait for upload completion (may take 1-10 minutes depending on file size)
3. Success message will appear upon completion
4. Movie will be saved to database with Cloudinary URL

## API Endpoint Reference

### Upload Movie/Show
**Endpoint:** POST `/api/upload/movie`

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Body:**
```
title: string (required)
description: string
image: string (required, URL)
duration: string
genres: string (comma-separated)
director: string
cast: string (comma-separated)
year: number
contentType: string (movie|show)
rating: string
trailer: File (optional, video)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "movie_id",
    "title": "Movie Title",
    "trailerUrl": "https://res.cloudinary.com/...",
    "createdBy": "admin_user_id",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

## Troubleshooting

### Upload Fails with "401 Unauthorized"
- Ensure you're logged in as admin
- Token might have expired, logout and login again
- Check JWT_SECRET matches between frontend and backend

### Upload Fails with "File too large"
- Maximum file size is 100MB
- Compress video before uploading
- Use a video compression tool like HandBrake

### Cloudinary Upload Fails
- Verify environment variables in `.env` are correct
- Check Cloudinary account is active and not in trial period
- Ensure API credentials are accurate (copy-paste carefully)
- Check network connectivity

### Form Won't Submit
- Fill in all required fields (Title, Image URL)
- Ensure image URL is valid and accessible
- Check browser console for detailed error messages

## Video Compression Tips

If your video file is too large (>100MB):

### Using FFmpeg (Free)
```bash
ffmpeg -i input.mp4 -vf scale=1280:720 -b:v 2M output.mp4
```

### Online Tools
- [CloudConvert](https://cloudconvert.com)
- [Online-Convert](https://online-convert.com)
- [Kapwing](https://www.kapwing.com/tools/crop-video)

## File Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── cloudinary.js (new)
│   │   ├── multer.js (new)
│   │   └── dbConnect.js
│   ├── controllers/
│   │   ├── uploadController.js (new)
│   │   └── authController.js
│   ├── routes/
│   │   ├── uploadRoutes.js (new)
│   │   └── authRoutes.js
│   ├── models/
│   │   ├── movieModel.js (updated)
│   │   └── userModel.js
│   └── middlewares/
│       ├── authMiddleware.js
│       └── errorHandler.js
└── server.js (updated)

frontend/
├── src/
│   ├── components/
│   │   ├── AdminUploadMovie.jsx (new)
│   │   ├── VideoPlayer.jsx (new)
│   │   └── [other components]
│   ├── pages/
│   │   ├── AdminDashboard.jsx (updated)
│   │   └── [other pages]
│   └── services/
│       ├── uploadService.js (new)
│       └── [other services]
```

## Next Steps

### Testing Checklist
- [ ] Backend server running on port 3001
- [ ] Frontend server running on port 5173
- [ ] Cloudinary credentials configured
- [ ] Login as admin user
- [ ] Navigate to Admin > Upload Content
- [ ] Upload a test movie with trailer
- [ ] Verify movie appears in database
- [ ] Check Cloudinary account shows uploaded video

### Future Enhancements
1. Add video preview before upload completion
2. Implement upload progress bar
3. Add video quality selection
4. Implement batch uploads
5. Add video trimming feature
6. Support other video formats (AVI, MOV)
7. Add thumbnail extraction from video
8. Implement scheduled publishing

## Support Resources
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Express.js Guide](https://expressjs.com)
- [React File Upload](https://reactjs.org)
- [Multer NPM](https://www.npmjs.com/package/multer)
