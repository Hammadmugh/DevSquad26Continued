// lib/socket.ts
import io, { Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocket = (token: string) => {
  // Only create socket once
  if (socket?.connected) {
    console.log('Socket already connected:', socket.id);
    return socket;
  }
  
  // Don't try to reconnect if already attempting
  if (socket) {
    console.log('Socket exists, returning existing instance:', socket.id);
    return socket;
  }

  console.log('Initializing new socket connection...');

  socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', {
    auth: {
      token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ['websocket', 'polling'],
  });

  // Listen for custom connection success event
  socket.on('connection:success', (data) => {
    console.log('Connected to WebSocket successfully', data);
  });

  // Standard socket events
  socket.on('connect', () => {
    console.log('✓ Socket.io connected, id:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('✗ Disconnected from WebSocket:', reason);
  });

  socket.on('error', (error) => {
    console.error('⚠ Socket error:', error);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const on = (event: string, callback: (...args: any[]) => void) => {
  if (socket) {
    console.log(`👂 Registering listener for event: ${event}`);
    socket.on(event, callback);
  } else {
    console.warn(`⚠ Socket not initialized, cannot listen to event: ${event}`);
  }
};

export const off = (event: string, callback?: (...args: any[]) => void) => {
  if (socket) {
    socket.off(event, callback);
  }
};

export const emit = (event: string, data: any) => {
  if (socket) {
    socket.emit(event, data);
  } else {
    console.warn(`Socket not initialized, cannot emit event: ${event}`);
  }
};
