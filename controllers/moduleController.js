import db from '../config/db.js';

// Get all modules with basic information
export const getAllModules = (req, res) => {
    const sql = `
        SELECT id, title, description, order_sequence 
        FROM modules 
        ORDER BY order_sequence
    `;

    db.query(sql, (error, results) => {
        if (error) return res.status(500).json({ message: error.message });
        res.json(results);
    });
};

// Get specific module details
export const getModuleById = (req, res) => {
    const { moduleId } = req.params;
    const sql = `SELECT * FROM modules WHERE id = ?`;

    db.query(sql, [moduleId], (error, results) => {
        if (error) return res.status(500).json({ message: error.message });

        if (results.length === 0) {
            return res.status(404).json({ message: "Module not found" });
        }

        res.json(results[0]);
    });
};

// Get all chapters for a module
export const getModuleChapters = (req, res) => {
    const { moduleId } = req.params;
    const sql = `
        SELECT id, title, description, order_sequence 
        FROM chapters 
        WHERE module_id = ? 
        ORDER BY order_sequence
    `;

    db.query(sql, [moduleId], (error, results) => {
        if (error) return res.status(500).json({ message: error.message });
        res.json(results);
    });
};

// Get chapter content with its subchapters
export const getChapterContent = (req, res) => {
    const { moduleId, chapterId } = req.params;

    const chapterSql = `
        SELECT * FROM chapters 
        WHERE id = ? AND module_id = ?
    `;

    db.query(chapterSql, [chapterId, moduleId], (error, chapterResult) => {
        if (error) return res.status(500).json({ message: error.message });

        if (chapterResult.length === 0) {
            return res.status(404).json({ message: "Chapter not found" });
        }

        const subchapterSql = `
            SELECT id, title, content_html, content_css, is_editable, order_sequence 
            FROM subchapters 
            WHERE chapter_id = ? AND module_id = ? 
            ORDER BY order_sequence
        `;

        db.query(subchapterSql, [chapterId, moduleId], (error, subchapters) => {
            if (error) return res.status(500).json({ message: error.message });

            res.json({
                ...chapterResult[0],
                subchapters,
            });
        });
    });
};

// Get specific subchapter content
export const getSubchapterContent = (req, res) => {
    const { moduleId, chapterId, subchapterId } = req.params;

    const sql = `
        SELECT * FROM subchapters 
        WHERE id = ? AND chapter_id = ? AND module_id = ?
    `;

    db.query(sql, [subchapterId, chapterId, moduleId], (error, results) => {
        if (error) return res.status(500).json({ message: error.message });

        if (results.length === 0) {
            return res.status(404).json({ message: "Subchapter not found" });
        }

        res.json(results[0]);
    });
};

export const updateSubchapterContent = (req, res) => {
    const { moduleId, chapterId, subchapterId } = req.params;
    const { content, content_html, content_css } = req.body;

    // 1. Cek apakah subchapter ada dan bisa diedit
    const checkSql = `
        SELECT is_editable FROM subchapters 
        WHERE id = ? AND chapter_id = ? AND module_id = ?
    `;

    db.query(checkSql, [subchapterId, chapterId, moduleId], (error, results) => {
        if (error) return res.status(500).json({ message: error.message });

        if (results.length === 0) {
            return res.status(404).json({ message: "Subchapter not found" });
        }

        if (!results[0].is_editable) {
            return res.status(403).json({ message: "This content is not editable" });
        }

        // 2. Update data kalau editable
        const updateSql = `
            UPDATE subchapters 
            SET content = ?, content_html = ?, content_css = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ? AND chapter_id = ? AND module_id = ?
        `;

        db.query(
            updateSql,
            [content, content_html, content_css, subchapterId, chapterId, moduleId],
            (error) => {
                if (error) return res.status(500).json({ message: error.message });

                res.json({ message: "Content updated successfully" });
            }
        );
    });
};
