import { useEffect, useRef } from 'react';
import { socketService } from '../services/socket';
import { AppFile } from '../types';

interface UseSocketProps {
  roomId?: string;
  onNewFile?: (file: AppFile) => void;
  onFileDeleted?: (fileId: string) => void;
  onUserJoined?: (data: { message: string; timestamp: string }) => void;
  onUserLeft?: (data: { message: string; timestamp: string }) => void;
}

export const useSocket = ({
  roomId,
  onNewFile,
  onFileDeleted,
  onUserJoined,
  onUserLeft,
}: UseSocketProps) => {
  const socketRef = useRef(socketService);

  useEffect(() => {
    const socket = socketRef.current.connect();

    if (roomId) {
      socket.emit('join_room', roomId);
    }

    if (onNewFile) {
      socket.on('new_file', onNewFile);
    }
    if (onFileDeleted) {
      socket.on('file_deleted', onFileDeleted);
    }
    if (onUserJoined) {
      socket.on('user_joined', onUserJoined);
    }
    if (onUserLeft) {
      socket.on('user_left', onUserLeft);
    }

    return () => {
      if (roomId) {
        socket.emit('leave_room', roomId);
      }
      socket.off('new_file');
      socket.off('file_deleted');
      socket.off('user_joined');
      socket.off('user_left');
      socketRef.current.disconnect();
    };
  }, [roomId, onNewFile, onFileDeleted, onUserJoined, onUserLeft]);

  return {
    isConnected: socketRef.current.isConnected(),
    joinRoom: socketRef.current.joinRoom.bind(socketRef.current),
    leaveRoom: socketRef.current.leaveRoom.bind(socketRef.current),
  };
};