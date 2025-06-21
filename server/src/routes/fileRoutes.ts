import express from 'express';
import { uploadFile, deleteFile, downloadFile, upload } from '../controllers/fileController';
import { authenticateToken, validateRoomAccess } from '../utils/middleware';

const router = express.Router();
router.post('/rooms/:roomId/upload', authenticateToken, validateRoomAccess, upload.single('file'), uploadFile);
router.delete('/:fileId', authenticateToken, deleteFile);
router.get('/:fileId/download', downloadFile);

export = router;