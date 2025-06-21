import { io, Socket } from 'socket.io-client';

const getSocketUrl = () => {
  const currentHost = window.location.host;
  if (currentHost.includes('devtunnels.ms')) {
    return `https://${currentHost.replace('-5173', '-3000')}`;
  }

  return import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
};

const SOCKET_URL = getSocketUrl();

class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        autoConnect: true,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 20000,
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

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketService = new SocketService();
export default socketService;