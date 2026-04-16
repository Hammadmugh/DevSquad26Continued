'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
}

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const initialLoadComplete = useRef(false);

  useEffect(() => {
    // Initialize Socket.IO connection
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    const newSocket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      if (initialLoadComplete.current) {
        toast.success('Connected to chat server', { position: 'top-right' });
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
      if (initialLoadComplete.current) {
        toast.error('Disconnected from server', { position: 'top-right' });
      }
    });

    // Load existing comments
    newSocket.on('load_comments', (loadedComments: Comment[]) => {
      const parsedComments = loadedComments.map((c) => ({
        ...c,
        timestamp: new Date(c.timestamp),
      }));
      setComments(parsedComments);
      setIsLoading(false);
      initialLoadComplete.current = true;
    });

    // Listen for new comments from other users
    newSocket.on('new_comment', (comment: Comment) => {
      const newComment = {
        ...comment,
        timestamp: new Date(comment.timestamp),
      };
      setComments((prev) => [...prev, newComment]);

      // Show notification for new comment only after initial load
      if (initialLoadComplete.current) {
        toast.success(`New comment from ${comment.author}: "${comment.text.substring(0, 40)}..."`, {
          position: 'bottom-right',
          duration: 4000,
        });
      }
    });

    // Listen for comment confirmation
    newSocket.on('comment_added', (comment: Comment) => {
      const newComment = {
        ...comment,
        timestamp: new Date(comment.timestamp),
      };
      setComments((prev) => [...prev, newComment]);
      if (initialLoadComplete.current) {
        toast.success('Comment posted!', { position: 'top-right' });
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      if (initialLoadComplete.current) {
        toast.error('Connection error. Please try again.', { position: 'top-right' });
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return { socket, comments, isLoading, isConnected };
}
