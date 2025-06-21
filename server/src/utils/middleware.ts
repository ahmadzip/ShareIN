import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './auth';

interface AuthRequest extends Request {
    user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token, please log in again'
        });
    }
};

export const validateRoomAccess = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { roomId } = req.params;
    const userRoomId = req.user?.roomId;

    if (!userRoomId || userRoomId !== roomId) {
        return res.status(403).json({
            success: false,
            message: 'Access denied to this room'
        });
    }

    next();
};