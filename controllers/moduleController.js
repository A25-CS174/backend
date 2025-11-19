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

// Get all subchapters for a chapter
export const getAllSubchapters = (req, res) => {
    const { moduleId, chapterId } = req.params;

    const sql = `
        SELECT id, title, content, content_html, content_css, is_editable, order_sequence, created_at, updated_at
        FROM subchapters
        WHERE chapter_id = ? AND module_id = ?
        ORDER BY order_sequence
    `;

    db.query(sql, [chapterId, moduleId], (error, results) => {
        if (error) return res.status(500).json({ message: error.message });
        res.json(results);
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

// Get all learning paths
export const getAllLearningPaths = (req, res) => {
    const sql = `
        SELECT lp.learning_path_id, lp.learning_path_name, lp.created_at, lp.updated_at,
               GROUP_CONCAT(m.id) as module_ids,
               GROUP_CONCAT(m.title) as module_titles
        FROM learning_paths lp
        LEFT JOIN learning_path_modules lpm ON lp.learning_path_id = lpm.learning_path_id
        LEFT JOIN modules m ON lpm.module_id = m.id
        GROUP BY lp.learning_path_id
        ORDER BY lp.learning_path_id
    `;

    db.query(sql, (error, results) => {
        if (error) return res.status(500).json({ message: error.message });

        // Process results to format modules as array
        const formattedResults = results.map(row => ({
            learning_path_id: row.learning_path_id,
            learning_path_name: row.learning_path_name,
            created_at: row.created_at,
            updated_at: row.updated_at,
            modules: row.module_ids ? row.module_ids.split(',').map((id, index) => ({
                id: parseInt(id),
                title: row.module_titles.split(',')[index]
            })) : []
        }));

        res.json(formattedResults);
    });
};

// Get specific learning path with its modules
export const getLearningPathById = (req, res) => {
    const { learningPathId } = req.params;

    const sql = `
        SELECT lp.learning_path_id, lp.learning_path_name, lp.created_at, lp.updated_at,
               m.id as module_id, m.title as module_title, m.description, m.order_sequence, m.hours_to_study
        FROM learning_paths lp
        LEFT JOIN learning_path_modules lpm ON lp.learning_path_id = lpm.learning_path_id
        LEFT JOIN modules m ON lpm.module_id = m.id
        WHERE lp.learning_path_id = ?
        ORDER BY m.order_sequence
    `;

    db.query(sql, [learningPathId], (error, results) => {
        if (error) return res.status(500).json({ message: error.message });

        if (results.length === 0) {
            return res.status(404).json({ message: "Learning path not found" });
        }

        const learningPath = {
            learning_path_id: results[0].learning_path_id,
            learning_path_name: results[0].learning_path_name,
            created_at: results[0].created_at,
            updated_at: results[0].updated_at,
            modules: results.filter(row => row.module_id).map(row => ({
                id: row.module_id,
                title: row.module_title,
                description: row.description,
                order_sequence: row.order_sequence,
                hours_to_study: row.hours_to_study
            }))
        };

        res.json(learningPath);
    });
};
