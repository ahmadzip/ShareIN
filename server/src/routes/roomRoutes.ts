import express from 'express';
import { createRoom, joinRoom, getRoomFiles } from '../controllers/roomController';
import { authenticateToken, validateRoomAccess } from '../utils/middleware';

const router = express.Router();
router.post('/', createRoom);
router.post('/join', joinRoom);
router.get('/:roomId/files', authenticateToken, validateRoomAccess, getRoomFiles);

export = router;