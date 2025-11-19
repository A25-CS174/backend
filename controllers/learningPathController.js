import db from '../config/db.js';

// Get all learning paths with their associated modules
export const getAllLearningPaths = (req, res) => {
    const sql = `
        SELECT lp.learning_path_id, lp.learning_path_name, lp.created_at, lp.updated_at,
               GROUP_CONCAT(m.id) as module_ids,
               GROUP_CONCAT(m.title) as module_titles,
               GROUP_CONCAT(m.description) as module_descriptions,
               GROUP_CONCAT(m.order_sequence) as module_order_sequences,
               GROUP_CONCAT(m.hours_to_study) as module_hours
        FROM learning_paths lp
        LEFT JOIN learning_path_modules lpm ON lp.learning_path_id = lpm.learning_path_id
        LEFT JOIN modules m ON lpm.module_id = m.id
        GROUP BY lp.learning_path_id
        ORDER BY lp.learning_path_id
    `;

    db.query(sql, (error, results) => {
        if (error) return res.status(500).json({ message: error.message });

        // Process results to format modules as array of objects
        const formattedResults = results.map(row => ({
            learning_path_id: row.learning_path_id,
            learning_path_name: row.learning_path_name,
            created_at: row.created_at,
            updated_at: row.updated_at,
            modules: row.module_ids ? row.module_ids.split(',').map((id, index) => ({
                id: parseInt(id),
                title: row.module_titles.split(',')[index],
                description: row.module_descriptions.split(',')[index],
                order_sequence: parseInt(row.module_order_sequences.split(',')[index]),
                hours_to_study: parseInt(row.module_hours.split(',')[index])
            })) : []
        }));

        res.json(formattedResults);
    });
};

// Get specific learning path with its modules
export const getLearningPathById = (req, res) => {
    const { learningpathId } = req.params;

    const sql = `
        SELECT lp.learning_path_id, lp.learning_path_name, lp.created_at, lp.updated_at,
               m.id as module_id, m.title as module_title, m.description, m.order_sequence, m.hours_to_study
        FROM learning_paths lp
        LEFT JOIN learning_path_modules lpm ON lp.learning_path_id = lpm.learning_path_id
        LEFT JOIN modules m ON lpm.module_id = m.id
        WHERE lp.learning_path_id = ?
        ORDER BY m.order_sequence
    `;

    db.query(sql, [learningpathId], (error, results) => {
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
