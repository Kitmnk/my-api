require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

// สร้าง connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Root route (เช็คว่า API รันได้)
app.get('/', (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

// API: ดึง users ทั้งหมด
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// API: เพิ่ม user
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    await pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);
    res.status(201).json({ message: "User created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Insert failed' });
  }
});

// API: อัปเดต user
app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, id]);
    res.json({ message: "User updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Update failed' });
  }
});

// API: ลบ user
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
