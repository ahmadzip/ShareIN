import express from 'express';
import { createRoom, joinRoom, getRoomFiles } from '../controllers/roomController';

const router = express.Router();
router.post('/', createRoom);
router.post('/join', joinRoom);

router.get('/:roomId/files', getRoomFiles);

export = router;