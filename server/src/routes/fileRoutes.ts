import express from 'express';
import { uploadFile, deleteFile, downloadFile, upload } from '../controllers/fileController';

const router = express.Router();
router.post('/rooms/:roomId/upload', upload.single('file'), uploadFile);
router.delete('/:fileId', deleteFile);
router.get('/:fileId/download', downloadFile);

export = router;