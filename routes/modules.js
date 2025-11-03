import express from 'express';
import { 
    getAllModules,
    getModuleById,
    getModuleChapters,
    getChapterContent,
    getSubchapterContent,
    // updateSubchapterContent
} from '../controllers/moduleController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get all modules with basic info
router.get('/', verifyToken, getAllModules);

// Get specific module details
router.get('/:moduleId', verifyToken, getModuleById);

// Get all chapters for a module
router.get('/:moduleId/chapters', verifyToken, getModuleChapters);

// Get chapter content with its subchapters
router.get('/:moduleId/chapters/:chapterId', verifyToken, getChapterContent);

// Get specific subchapter content
router.get('/:moduleId/chapters/:chapterId/subchapters/:subchapterId', verifyToken, getSubchapterContent);

// Update subchapter content (for editable content)
// router.put('/:moduleId/chapters/:chapterId/subchapters/:subchapterId', verifyToken, updateSubchapterContent);

export default router;