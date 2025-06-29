const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const cors = require("cors");
require('dotenv').config();

const app = express();
const port =process.env.port || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// ✅ Allow all origins temporarily
app.use(cors({
  origin:"https://waitlist-production-cc6f.up.railway.app/"
}
  
));

// ✅ MySQL connection
const dbUrl = new URL(process.env.MYSQL_URL);
const db = mysql.createConnection({
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace('/', ''),
  port: dbUrl.port,
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

// ✅ Create table
const tableQuery = `
  CREATE TABLE IF NOT EXISTS waitlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;
db.query(tableQuery);

// ✅ Route
app.post("/api/waitlist", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "INSERT INTO waitlist (name, email) VALUES (?, ?)";
  db.query(sql, [name, email], (err) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "You're already enrolled!" });
      }
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
    res.status(200).json({ message: "Successfully enrolled! We'll update you soon." });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
