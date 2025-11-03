import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { validationResult } from "express-validator";
dotenv.config();

export const register = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

<<<<<<< HEAD
  const { name, email, password } = req.body;
  db.query("SELECT id FROM users WHERE email = ?", [email], (err, rows) => {
    console.log(err);
=======
  const { name, city, email, password } = req.body;
  db.query("SELECT id FROM users WHERE email = ?", [email], (err, rows) => {
>>>>>>> bf24b3ea7fcbaff47c1419607bbf19d5d209c311
    if (err) return res.status(500).json({ error: "DB error" });
    if (rows.length)
      return res.status(400).json({ error: "Email already registered" });

    const hashed = bcrypt.hashSync(password, 10);
    db.query(
<<<<<<< HEAD
      "INSERT INTO users (name,email,password) VALUES (?, ?, ?)",
      [name, email, hashed],
=======
      "INSERT INTO users (name, city, email, password) VALUES (?, ?, ?, ?)",
      [name, city, email, hashed],    
>>>>>>> bf24b3ea7fcbaff47c1419607bbf19d5d209c311
      (err, result) => {
        if (err) return res.status(500).json({ error: "DB insert error" });
        const userId = result.insertId;

<<<<<<< HEAD
        // initialize user_module_progress for all modules (so frontend can render modules list)
=======
        // initialize user_module_progress for all modules
>>>>>>> bf24b3ea7fcbaff47c1419607bbf19d5d209c311
        db.query("SELECT id FROM modules", (err, modules) => {
          if (!err && modules.length) {
            const values = modules.map((m) => [userId, m.id, 0, "not_started"]);
            db.query(
              "INSERT INTO user_module_progress (user_id, module_id, progress, status) VALUES ?",
              [values],
              (e) => {
                if (e) console.error("init progress error", e);
<<<<<<< HEAD
                // create initial progress_history entry (0%)
=======
>>>>>>> bf24b3ea7fcbaff47c1419607bbf19d5d209c311
                db.query(
                  "INSERT INTO progress_history (user_id, percentage) VALUES (?, ?)",
                  [userId, 0]
                );
<<<<<<< HEAD
                const token = jwt.sign(
                  { id: userId, email },
                  process.env.JWT_SECRET,
                  { expiresIn: process.env.JWT_EXPIRES_IN }
                );
                res.status(201).json({ message: "User registered", token });
=======

                db.query(
                  "INSERT INTO langganan (user_id, title, deskripsi_paket, status_aktif, valid_until) VALUES (?, ?, ?, ?, ?)",
                  [userId, "Free Plan", "Akses dasar tanpa biaya", 1, null],
                  (err2) => {
                    if (err2) console.error("init langganan error", err2);
                    const token = jwt.sign(
                      { id: userId, email },
                      process.env.JWT_SECRET,
                      { expiresIn: process.env.JWT_EXPIRES_IN }
                    );
                    res
                      .status(201)
                      .json({ message: "User registered", token });
                  }
                );
>>>>>>> bf24b3ea7fcbaff47c1419607bbf19d5d209c311
              }
            );
          } else {
            // no modules yet — still create history & return token
            db.query(
              "INSERT INTO progress_history (user_id, percentage) VALUES (?, ?)",
              [userId, 0]
            );
<<<<<<< HEAD
            const token = jwt.sign(
              { id: userId, email },
              process.env.JWT_SECRET,
              { expiresIn: process.env.JWT_EXPIRES_IN }
            );
            res.status(201).json({ message: "User registered", token });
=======

            db.query(
              "INSERT INTO langganan (user_id, title, deskripsi_paket, status_aktif, valid_until) VALUES (?, ?, ?, ?, ?)",
              [userId, "Free Plan", "Akses dasar tanpa biaya", 1, null],
              (err2) => {
                if (err2) console.error("init langganan error", err2);
                const token = jwt.sign(
                  { id: userId, email },
                  process.env.JWT_SECRET,
                  { expiresIn: process.env.JWT_EXPIRES_IN }
                );
                res.status(201).json({ message: "User registered", token });
              }
            );
>>>>>>> bf24b3ea7fcbaff47c1419607bbf19d5d209c311
          }
        });
      }
    );
  });
};

export const login = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error" });
    if (!rows.length)
      return res.status(400).json({ error: "Invalid credentials" });

    const user = rows[0];
    const match = bcrypt.compareSync(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.json({ message: "Login success", token });
  });
<<<<<<< HEAD
};
=======
};
>>>>>>> bf24b3ea7fcbaff47c1419607bbf19d5d209c311
