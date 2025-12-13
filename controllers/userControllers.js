import db from '../config/db.js';

// Get all users
export const getUsers = (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error("getUsers error", err);
            res.status(500).json({ error: 'Database query error' });
        } else {
            res.json(results);
        }
    });
};

//endpoint to get data for chart visualization
export const getChartData = (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT MONTH(created_at) AS month, COUNT(*) AS user_count
        FROM users
        WHERE id = ?
        GROUP BY MONTH(created_at) 
        ORDER BY MONTH(created_at);
    `;
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Database query error' });
        } else {
            //ubah hasil ke format yang sesuai untuk chart
            const labels = results.map(row => `Bulan ${row.month}`);
            const data = results.map(row => row.user_count);
            res.json({ labels, data });
        }
    });
}

export const addUser = (req, res) => {
    const { name, email, password } = req.body;
    
    //cek email
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query error' });

        if (results.length > 0) {
            return res.status(400).json({ error: 'Email sudah terdaftar' });
        }

        //kalau belum, tambahkan user baru
        const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.query(sql, [name, email, password], (err, result) => {
            if (err) return res.status(500).json({ error: 'Gagal menyimpan data' });

            res.status(201).json({ 
                message: 'User berhasil ditambahkan', 
                userId: result.insertId });
        });
    });
}