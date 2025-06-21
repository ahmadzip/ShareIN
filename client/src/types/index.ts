export interface Room {
  id: string;
  name: string;
  createdAt: string;
}

export interface AppFile {
  id: string;
  filename: string;
  storedAs: string;
  path: string;
  mimetype: string;
  size: number;
  roomId: string;
  createdAt: string;
}

export interface CreateRoomData {
  name: string;
  password: string;
}

export interface JoinRoomData {
  roomId: string;
  password: string;
}

export interface CreateRoomResponse {
  success: boolean;
  data: {
    roomId: string;
    name: string;
    token: string;
  };
  message?: string;
}

export interface JoinRoomResponse {
  success: boolean;
  data: {
    roomId: string;
    name: string;
    token: string;
    files: AppFile[];
  };
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

export interface SocketEvents {
  join_room: (roomId: string) => void;
  leave_room: (roomId: string) => void;
  new_file: (file: AppFile) => void;
  file_deleted: (fileId: string) => void;
  user_joined: (data: { message: string; timestamp: string }) => void;
  user_left: (data: { message: string; timestamp: string }) => void;
}