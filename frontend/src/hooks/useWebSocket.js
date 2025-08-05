import { useEffect, useRef, useState, useCallback } from 'react';
import io from 'socket.io-client';

export const useWebSocket = (url, options = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = options.maxReconnectAttempts || 5;
  const reconnectDelay = options.reconnectDelay || 1000;

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    try {
      socketRef.current = io(url, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: reconnectDelay,
        ...options,
      });

      socketRef.current.on('connect', () => {
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
        console.log('WebSocket connected');
      });

      socketRef.current.on('disconnect', (reason) => {
        setIsConnected(false);
        console.log('WebSocket disconnected:', reason);
      });

      socketRef.current.on('connect_error', (err) => {
        setError(err.message);
        console.error('WebSocket connection error:', err);
      });

      socketRef.current.on('reconnect_attempt', (attemptNumber) => {
        reconnectAttempts.current = attemptNumber;
        console.log(`WebSocket reconnection attempt ${attemptNumber}`);
      });

      socketRef.current.on('reconnect_failed', () => {
        setError('Failed to reconnect after maximum attempts');
        console.error('WebSocket reconnection failed');
      });

    } catch (err) {
      setError(err.message);
      console.error('WebSocket connection error:', err);
    }
  }, [url, maxReconnectAttempts, reconnectDelay, options]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const emit = useCallback((event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('WebSocket not connected, cannot emit event:', event);
    }
  }, []);

  const on = useCallback((event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  const off = useCallback((event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    error,
    emit,
    on,
    off,
    connect,
    disconnect,
    socket: socketRef.current,
  };
}; 