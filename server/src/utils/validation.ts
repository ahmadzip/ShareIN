import { z } from 'zod';

export const createRoomSchema = z.object({
  name: z.string().min(1, "Room name is required").max(50, "Room name too long"),
  password: z.string().min(4, "Password must be at least 4 characters").max(50, "Password too long")
});

export const joinRoomSchema = z.object({
  roomId: z.string().min(1, "Room ID is required"),
  password: z.string().min(1, "Password is required")
});

export const uploadFileSchema = z.object({
  roomId: z.string().min(1, "Room ID is required")
});

export const deleteFileSchema = z.object({
  fileId: z.string().min(1, "File ID is required")
});

export type CreateRoomData = z.infer<typeof createRoomSchema>;
export type JoinRoomData = z.infer<typeof joinRoomSchema>;
export type UploadFileData = z.infer<typeof uploadFileSchema>;
export type DeleteFileData = z.infer<typeof deleteFileSchema>;