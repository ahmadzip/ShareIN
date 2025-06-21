import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        autoConnect: false,
        transports: ['websocket', 'polling'],
      });
    }

    if (!this.socket.connected) {
      this.socket.connect();
    }

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(roomId: string): void {
    if (this.socket) {
      this.socket.emit('join_room', roomId);
    }
  }

  leaveRoom(roomId: string): void {
    if (this.socket) {
      this.socket.emit('leave_room', roomId);
    }
  }

  onNewFile(callback: (file: any) => void): void {
    if (this.socket) {
      this.socket.on('new_file', callback);
    }
  }

  onFileDeleted(callback: (fileId: string) => void): void {
    if (this.socket) {
      this.socket.on('file_deleted', callback);
    }
  }

  onUserJoined(callback: (data: { message: string; timestamp: string }) => void): void {
    if (this.socket) {
      this.socket.on('user_joined', callback);
    }
  }

  onUserLeft(callback: (data: { message: string; timestamp: string }) => void): void {
    if (this.socket) {
      this.socket.on('user_left', callback);
    }
  }

  off(eventName: string): void {
    if (this.socket) {
      this.socket.off(eventName);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
export default socketService;