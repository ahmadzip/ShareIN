import axios from 'axios';
import { CreateRoomData, JoinRoomData, CreateRoomResponse, JoinRoomResponse, ApiResponse, AppFile } from '../types';

const getApiBaseUrl = () => {
  const currentHost = window.location.host;
  if (currentHost.includes('devtunnels.ms')) {
    return `https://${currentHost.replace('-5173', '-3000')}/api`;
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sharaein_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const roomApi = {
  createRoom: async (data: CreateRoomData): Promise<CreateRoomResponse> => {
    const response = await api.post('/rooms', data);
    return response.data;
  },

  joinRoom: async (data: JoinRoomData): Promise<JoinRoomResponse> => {
    const response = await api.post('/rooms/join', data);
    return response.data;
  },

  getRoomFiles: async (roomId: string): Promise<ApiResponse<AppFile[]>> => {
    const response = await api.get(`/rooms/${roomId}/files`);
    return response.data;
  },
};

export const fileApi = {
  uploadFile: async (roomId: string, file: File): Promise<ApiResponse<AppFile>> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/files/rooms/${roomId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteFile: async (fileId: string): Promise<ApiResponse> => {
    const response = await api.delete(`/files/${fileId}`);
    return response.data;
  },

  getDownloadUrl: (fileId: string): string => {
    const token = localStorage.getItem('sharaein_token');
    const baseUrl = `${API_BASE_URL}/files/${fileId}/download`;
    return token ? `${baseUrl}?token=${encodeURIComponent(token)}` : baseUrl;
  },
};

export default api;