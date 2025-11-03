import db from '../config/db.js';

// Get all modules with basic information
export const getAllModules = async (req, res) => {
    try {
        const [modules] = await db.query(
            `SELECT id, title, description, order_sequence 
             FROM modules 
             ORDER BY order_sequence`
        );
        res.json(modules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get specific module details
export const getModuleById = async (req, res) => {
    try {
        const { moduleId } = req.params;
        const [module] = await db.query(
            `SELECT * FROM modules WHERE id = ?`,
            [moduleId]
        );
        
        if (module.length === 0) {
            return res.status(404).json({ message: "Module not found" });
        }
        
        res.json(module[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all chapters for a module
export const getModuleChapters = async (req, res) => {
    try {
        const { moduleId } = req.params;
        const [chapters] = await db.query(
            `SELECT id, title, description, order_sequence 
             FROM chapters 
             WHERE module_id = ? 
             ORDER BY order_sequence`,
            [moduleId]
        );
        res.json(chapters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get chapter content with its subchapters
export const getChapterContent = async (req, res) => {
    try {
        const { moduleId, chapterId } = req.params;
        
        // Get chapter details
        const [chapter] = await db.query(
            `SELECT * FROM chapters WHERE id = ? AND module_id = ?`,
            [chapterId, moduleId]
        );
        
        if (chapter.length === 0) {
            return res.status(404).json({ message: "Chapter not found" });
        }
        
        // Get subchapters
        const [subchapters] = await db.query(
            `SELECT id, title, content_html, content_css, is_editable, order_sequence 
             FROM subchapters 
             WHERE chapter_id = ? AND module_id = ? 
             ORDER BY order_sequence`,
            [chapterId, moduleId]
        );
        
        res.json({
            ...chapter[0],
            subchapters
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get specific subchapter content
export const getSubchapterContent = async (req, res) => {
    try {
        const { moduleId, chapterId, subchapterId } = req.params;
        
        const [subchapter] = await db.query(
            `SELECT * FROM subchapters 
             WHERE id = ? AND chapter_id = ? AND module_id = ?`,
            [subchapterId, chapterId, moduleId]
        );
        
        if (subchapter.length === 0) {
            return res.status(404).json({ message: "Subchapter not found" });
        }
        
        res.json(subchapter[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update subchapter content (for editable content)
// export const updateSubchapterContent = async (req, res) => {
//     try {
//         const { moduleId, chapterId, subchapterId } = req.params;
//         const { content, content_html, content_css } = req.body;
        
//         // Check if subchapter exists and is editable
//         const [subchapter] = await db.query(
//             `SELECT is_editable FROM subchapters 
//              WHERE id = ? AND chapter_id = ? AND module_id = ?`,
//             [subchapterId, chapterId, moduleId]
//         );
        
//         if (subchapter.length === 0) {
//             return res.status(404).json({ message: "Subchapter not found" });
//         }
        
//         if (!subchapter[0].is_editable) {
//             return res.status(403).json({ message: "This content is not editable" });
//         }
        
//         // Update content
//         await db.query(
//             `UPDATE subchapters 
//              SET content = ?, content_html = ?, content_css = ?, updated_at = CURRENT_TIMESTAMP 
//              WHERE id = ? AND chapter_id = ? AND module_id = ?`,
//             [content, content_html, content_css, subchapterId, chapterId, moduleId]
//         );
        
//         res.json({ message: "Content updated successfully" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };