require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// API: ดึงข้อมูลทั้งหมด
app.get('/users', async (req, res) => {
  const result = await pool.query('SELECT * FROM users');
  res.json(result.rows);
});

// API: เพิ่มข้อมูล
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  await pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);
  res.sendStatus(201);
});

app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, id]);
  res.sendStatus(200);
});

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
  res.sendStatus(200);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});