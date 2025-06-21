import { Server } from 'socket.io';

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    socket.on('join_room', (roomId: string) => {
      socket.join(roomId);
      console.log(`👥 User ${socket.id} joined room ${roomId}`);

      socket.to(roomId).emit('user_joined', {
        message: `A user joined the room`,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('leave_room', (roomId: string) => {
      socket.leave(roomId);
      console.log(`👋 User ${socket.id} left room ${roomId}`);

      socket.to(roomId).emit('user_left', {
        message: `A user left the room`,
        timestamp: new Date().toISOString()
      });
    });

    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });

    socket.on('file_upload_progress', (data) => {
      socket.to(data.roomId).emit('file_upload_progress', data);
    });
  });
};