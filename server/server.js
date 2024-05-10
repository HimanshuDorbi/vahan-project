const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const mysql = require("mysql2");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

// MySQL Connection
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Check and create database table if they don't exist
pool.query(
  "CREATE DATABASE IF NOT EXISTS crud_app",
  (error, results, fields) => {
    if (error) {
      console.error("Error creating database:", error);
      return;
    }
    console.log("Database 'crud_app' created or already exists..");
    // 'crud_app'--> database name
    pool.query("USE crud_app", (error, results, fields) => {
      if (error) {
        console.error("Error selecting database:", error);
        return;
      }
      console.log("Using database 'crud_app'");
      pool.query(
        //query to create table
        `CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          firstName VARCHAR(255) NOT NULL,
          lastName VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          dateOfBirth DATE,
          profileImage VARCHAR(255)
        )`,
        (error, results, fields) => {
          if (error) {
            console.error("Error creating table:", error);
            return;
          }
          console.log("Table 'users' created or already exists...");
        }
      );
    });
  }
);

// Multer
const storage = multer.diskStorage({
  destination: path.join(__dirname, "./uploads"),
  filename: (req, file, cb) => {
    // Change profileImage to filename
    cb(null, `${Date.now()}- ${file.originalname}`);
  },
});

const upload = multer({ storage });


// Create new user
app.post("/api/users", upload.single("profileImage"), (req, res) => {
  const { firstName, lastName, email, phone, dateOfBirth } = req.body;
  const profileImage = req.file ? req.file.filename : null;

  // console.log("req body======>>", firstName, profileImage);

  pool.query(
    "INSERT INTO users (firstName, lastName, email, phone, dateOfBirth, profileImage) VALUES (?, ?, ?, ?,?, ?)",
    [firstName, lastName, email, phone, dateOfBirth, profileImage],
    (error, results, fields) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      res.json({
        id: results.insertId,
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        profileImage,
      });
    }
  );
});

// Update user by ID
app.put("/api/users/update/:id", upload.single("profileImage"), (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, email, phone, dateOfBirth } = req.body;
  const profileImage = req.file ? req.file.filename : null;

  // console.log("req body======>>", firstName, profileImage);

  pool.query(
    "UPDATE users SET firstName=?, lastName=?, email=?, phone=?,dateOfBirth=?, profileImage=? WHERE id=?",
    [firstName, lastName, email, phone, dateOfBirth, profileImage, userId],
    (error, results, fields) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({
        id: userId,
        firstName,
        lastName,
        email,
        phone,
        dateOfBirth,
        profileImage,
      });
    }
  );
});

// Get all users
app.get("/api/users", (req, res) => {
  pool.query("SELECT * FROM users", (error, results, fields) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(results); // Return all users
  });
});

// Delete  users
app.delete("/api/users/:id", (req, res) => {
  const userId = req.params.id;
  pool.query(
    "DELETE FROM users WHERE id = ?",
    [userId],
    (error, results, fields) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    }
  );
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
