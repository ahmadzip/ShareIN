import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createRoomSchema, joinRoomSchema } from '../utils/validation';
import { generateRoomId, hashPassword, comparePassword, generateToken } from '../utils/auth';

const prisma = new PrismaClient();

export const createRoom = async (req: Request, res: Response) => {
  try {
    const { name, password } = createRoomSchema.parse(req.body);
    const roomId = generateRoomId();
    const hashedPassword = await hashPassword(password);
    const room = await prisma.room.create({
      data: {
        id: roomId,
        name,
        password: hashedPassword,
      },
    });
    const token = generateToken({ roomId: room.id, name: room.name });

    res.status(201).json({
      success: true,
      data: {
        roomId: room.id,
        name: room.name,
        token
      }
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }

    console.error('Create room error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const joinRoom = async (req: Request, res: Response) => {
  try {
    const { roomId, password } = joinRoomSchema.parse(req.body);
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: { files: true }
    });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    const isPasswordValid = await comparePassword(password, room.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid password'
      });
    }
    const token = generateToken({ roomId: room.id, name: room.name });

    res.json({
      success: true,
      data: {
        roomId: room.id,
        name: room.name,
        token,
        files: room.files
      }
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }

    console.error('Join room error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getRoomFiles = async (req: Request, res: Response) => {
  try {
    const { roomId } = req.params;

    const files = await prisma.file.findMany({
      where: { roomId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: files
    });
  } catch (error) {
    console.error('Get room files error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};