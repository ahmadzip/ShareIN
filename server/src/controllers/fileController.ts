import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { generateUniqueFilename } from '../utils/auth';
import { io } from '../index';

const prisma = new PrismaClient();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = generateUniqueFilename(file.originalname);
    cb(null, uniqueFilename);
  }
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
});

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId }
    });

    if (!room) {
      await fs.unlink(file.path);
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    const savedFile = await prisma.file.create({
      data: {
        filename: file.originalname,
        storedAs: file.filename,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
        roomId
      }
    });

    io.to(roomId).emit('new_file', savedFile);

    res.status(201).json({
      success: true,
      data: savedFile
    });
  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;
    const file = await prisma.file.findUnique({
      where: { id: fileId }
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }
    try {
      await fs.unlink(file.path);
    } catch (fsError) {
      console.error('Error deleting file from filesystem:', fsError);
    }

    await prisma.file.delete({
      where: { id: fileId }
    });

    io.to(file.roomId).emit('file_deleted', fileId);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const downloadFile = async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;

    const file = await prisma.file.findUnique({
      where: { id: fileId }
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    try {
      await fs.access(file.path);
    } catch {
      return res.status(404).json({
        success: false,
        message: 'File not found on disk'
      });
    }

    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.setHeader('Content-Type', file.mimetype);

    res.sendFile(path.resolve(file.path));
  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};