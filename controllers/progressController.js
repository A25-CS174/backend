import db from "../config/db.js";

/**
 * Helper: compute overall percentage = weighted average of module progress
 */
function computeOverallFromRows(rows) {
  if (!rows.length) return 0;
  const sum = rows.reduce((acc, r) => acc + (r.progress || 0), 0);
  const avg = Math.round(sum / rows.length);
  return avg;
}

/**
 * Helper: compute module progress based on chapter completion
 */
async function computeModuleProgress(moduleId, userId) {
    const [chapters] = await db.query(
        `SELECT c.id, 
                IFNULL(
                    (SELECT COUNT(*) 
                     FROM subchapters s 
                     WHERE s.chapter_id = c.id 
                     AND s.id IN (
                         SELECT subchapter_id 
                         FROM user_progress 
                         WHERE user_id = ? AND completed = 1
                     )
                    ) * 100.0 / 
                    (SELECT COUNT(*) 
                     FROM subchapters 
                     WHERE chapter_id = c.id
                    ),
                0) as chapter_progress
         FROM chapters c 
         WHERE c.module_id = ?`,
        [userId, moduleId]
    );
    
    if (!chapters.length) return 0;
    
    const totalProgress = chapters.reduce((sum, chapter) => sum + chapter.chapter_progress, 0);
    return Math.round(totalProgress / chapters.length);
}

/**
 * GET /api/progress/overview
 * -> returns percentage, milestones, modules[], recommendation
 */
export const getProgressOverview = (req, res) => {
  const userId = req.user.id;
  // get modules with user progress
  const sql = `
    SELECT m.id, m.title, IFNULL(ump.progress,0) AS progress
    FROM modules m
    LEFT JOIN user_module_progress ump ON m.id = ump.module_id AND ump.user_id = ?
    ORDER BY m.id;
  `;
  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error" });

    // modules with status
    const modules = rows.map((r) => {
      let status = "not_started";
      if (r.progress >= 100) status = "completed";
      else if (r.progress > 0) status = "in_progress";
      return { id: r.id, title: r.title, progress: r.progress, status };
    });

    const overall = computeOverallFromRows(rows);

    // milestones achieved boolean list
    const milestones = [25, 50, 75, 100].map((m) => ({
      milestone: m,
      achieved: overall >= m,
    }));

    // recommendation: next module not completed with lowest progress
    const notCompleted = modules
      .filter((m) => m.progress < 100)
      .sort((a, b) => a.progress - b.progress);
    const recommendation = notCompleted.length
      ? {
          moduleId: notCompleted[0].id,
          title: notCompleted[0].title,
          reason: `Current progress ${notCompleted[0].progress}% — disarankan lanjutkan`,
        }
      : {
          message:
            "Semua modul selesai. Pertimbangkan review atau modul lanjutan.",
        };

    res.json({
      percentage: overall,
      milestones,
      modules,
      recommendation,
    });
  });
};

/**
 * POST /api/progress/module/:moduleId/update
 * body: { progress: number }  // 0..100
 * update user_module_progress, set status accordingly, add progress_history overall
 */
export const updateModuleProgress = (req, res) => {
  const userId = req.user.id;
  const { moduleId } = req.params;
  const { progress } = req.body;
  if (typeof progress !== "number" || progress < 0 || progress > 100) {
    return res
      .status(400)
      .json({ error: "Progress must be number between 0 and 100" });
  }

  // determine status
  const status =
    progress >= 100
      ? "completed"
      : progress === 0
      ? "not_started"
      : "in_progress";

  // upsert into user_module_progress
  const upsertSql = `
    INSERT INTO user_module_progress (user_id, module_id, progress, status)
    VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE progress = VALUES(progress), status = VALUES(status), updated_at = CURRENT_TIMESTAMP;
  `;
  db.query(upsertSql, [userId, moduleId, progress, status], (err) => {
    if (err) return res.status(500).json({ error: "DB upsert error" });

    // recalc overall percentage
    const sql = "SELECT progress FROM user_module_progress WHERE user_id = ?";
    db.query(sql, [userId], (e, rows) => {
      if (e) return res.status(500).json({ error: "DB error" });
      const overall = computeOverallFromRows(rows);
      // insert into history
      db.query(
        "INSERT INTO progress_history (user_id, percentage) VALUES (?, ?)",
        [userId, overall],
        (ee) => {
          if (ee) console.error("history insert error", ee);
          // return updated overview
          // reuse getProgressOverview logic quickly (select modules)
          const overviewSql = `
          SELECT m.id, m.title, IFNULL(ump.progress,0) AS progress
          FROM modules m
          LEFT JOIN user_module_progress ump ON m.id = ump.module_id AND ump.user_id = ?
          ORDER BY m.id;
        `;
          db.query(overviewSql, [userId], (err2, rows2) => {
            if (err2) return res.status(500).json({ error: "DB error" });
            const modules = rows2.map((r) => {
              let st = "not_started";
              if (r.progress >= 100) st = "completed";
              else if (r.progress > 0) st = "in_progress";
              return {
                id: r.id,
                title: r.title,
                progress: r.progress,
                status: st,
              };
            });
            const milestones = [25, 50, 75, 100].map((m) => ({
              milestone: m,
              achieved: overall >= m,
            }));
            const notCompleted = modules
              .filter((m) => m.progress < 100)
              .sort((a, b) => a.progress - b.progress);
            const recommendation = notCompleted.length
              ? {
                  moduleId: notCompleted[0].id,
                  title: notCompleted[0].title,
                  reason: `Current progress ${notCompleted[0].progress}% — disarankan lanjutkan`,
                }
              : {
                  message:
                    "Semua modul selesai. Pertimbangkan review atau modul lanjutan.",
                };

            res.json({
              message: "Progress updated",
              percentage: overall,
              milestones,
              modules,
              recommendation,
            });
          });
        }
      );
    });
  });
};

/**
 * GET /api/progress/chart
 * return time-series of overall progress for Chart.js
 * { labels: ['2025-10-01', ...], data: [10, 20, 40, ...] }
 */
export const getChartData = (req, res) => {
  const userId = req.user.id;
  const sql = `SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS date, percentage
               FROM progress_history
               WHERE user_id = ?
               ORDER BY created_at ASC`;
  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error" });
    const labels = rows.map((r) => r.date);
    const data = rows.map((r) => r.percentage);
    res.json({ labels, data });
  });
};

/**
 * GET /api/progress/modules/bar
 * return modules names and current progress (bar chart)
 * { labels: ['Modul 1', 'Modul 2'], data: [80, 20] }
 */
export const getModulesBarData = (req, res) => {
  const userId = req.user.id;
  const sql = `
    SELECT m.title, IFNULL(ump.progress, 0) AS progress
    FROM modules m
    LEFT JOIN user_module_progress ump ON m.id = ump.module_id AND ump.user_id = ?
    ORDER BY m.id;
  `;
  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error" });
    const labels = rows.map((r) => r.title);
    const data = rows.map((r) => r.progress);
    res.json({ labels, data });
  });
};
