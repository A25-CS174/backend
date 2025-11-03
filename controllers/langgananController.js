import db from "../config/db.js";

export const getLangganan = (req, res) => {
  db.query("SELECT * FROM langganan", (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error" });
    console.log(rows);
    res.json(rows);
  });
};

export const addLangganan = (req, res) => {
  const { user_id, title, deskripsi, status, valid_until } = req.body;
  db.query(
    "INSERT INTO langganan (user_id, title, deskripsi, status, valid_until) VALUES (?, ?, ?, ?, ?)",
    [user_id, title, deskripsi, status, valid_until],
    (err, result) => {
       console.log(err);
      if (err) return res.status(500).json({ error: "DB insert error" });
      res.status(201).json({ message: "Langganan berhasil ditambahkan" });
    }
  );
};

export const updateLangganan = (req, res) => {
  const { id } = req.params;
  const { title, deskripsi, status, valid_until } = req.body;
  db.query(
    "UPDATE langganan SET title=?, deskripsi=?, status=?, valid_until=? WHERE id=?",
    [title, deskripsi, status, valid_until, id],
    (err) => {
      if (err) return res.status(500).json({ error: "DB update error" });
      res.json({ message: "Langganan berhasil diperbarui" });
    }
  );
};

export const deleteLangganan = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM langganan WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: "DB delete error" });
    res.json({ message: "Langganan berhasil dihapus" });
  });
};
