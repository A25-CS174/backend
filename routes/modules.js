import express from 'express';
import {
    getAllModules,
    getModuleById,
    getModuleChapters,
    getChapterContent,
    getAllSubchapters,
    getSubchapterContent,
    updateSubchapterContent
} from '../controllers/moduleController.js';
import {  authMiddleware  } from '../middleware/auth.js';

const router = express.Router();

// Get all modules with basic info
router.get('/', authMiddleware, getAllModules);

// Get specific module details
router.get('/:moduleId', authMiddleware, getModuleById);

// Get all chapters for a module
router.get('/:moduleId/chapters', authMiddleware, getModuleChapters);

// Get chapter content with its subchapters
router.get('/:moduleId/chapters/:chapterId', authMiddleware, getChapterContent);

//Get subchapters of a chapter
router.get('/:moduleId/chapters/:chapterId/subchapters', authMiddleware, getAllSubchapters);

// Get specific subchapter content
router.get('/:moduleId/chapters/:chapterId/subchapters/:subchapterId', authMiddleware, getSubchapterContent);

// Update subchapter content (for editable content)
router.put('/:moduleId/chapters/:chapterId/subchapters/:subchapterId', authMiddleware, updateSubchapterContent);



export default router;
