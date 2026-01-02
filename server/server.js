const PORT = 8000;
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cors());

// Get
app.get("/todos/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const response = await pool.query(`SELECT * FROM todos WHERE email = $1`, [
      email,
    ]);
    res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

// Add
app.post("/todos", async (req, res) => {
  const { email, title, progress, date } = req.body;
  const id = uuidv4();
  try {
    const newTodo = pool.query(
      `INSERT INTO todos(id, email, title, progress, date) VALUES ($1,$2,$3,$4,$5)`,
      [id, email, title, progress, date]
    );
    res.json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

// Update
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { email, title, progress, date } = req.body;
  try {
    const response = await pool.query(
      `
            UPDATE todos
            SET email=$2 ,title=$3 ,progress=$4 ,date=$5
            WHERE id=$1
            `,
      [id, email, title, progress, date]
    );
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

// Delete
app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await pool.query(`DELETE FROM todos WHERE id = $1`, [id]);
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
});

// Auth

// Sign Up
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const salt = bcrypt.genSaltSync(12);
  const hashed_password = bcrypt.hashSync(password, salt);

  try {
    const signup = await pool.query(
      `INSERT INTO users (email, hashed_password) VALUES ($1, $2)`,
      [email, hashed_password]
    );

    const token = jwt.sign({ email }, "secret", { expiresIn: "1h" });
    res.status(200).json({ email, token });
  } catch (error) {
    console.error(error);
    if (error) {
      res.json({ detail: 'User already exists' });
    }
  }
});

// Log In
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    if (!users.rows.length) return res.json({ detail: "user does not exit" });
    const success = await bcrypt.compare(
      password,
      users.rows[0].hashed_password
    );
    if (success) {
      const token = jwt.sign({ email }, "secret", { expiresIn: "1h" });
      res.json({ email: users.rows[0].email, token });
    } else {
      res.json({ detail: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, console.log(`server is running at PORT ${PORT}`));
