import express from 'express';
import { getAllLearningPaths, getLearningPathById } from '../controllers/learningPathController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all learning paths with their modules
router.get('/', authMiddleware, getAllLearningPaths);

// Get specific learning path with its modules
router.get('/:learningpathId', authMiddleware, getLearningPathById);

export default router;
