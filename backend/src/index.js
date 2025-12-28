const express = require("express");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


// Healthcheck simple (app viva)
app.get("/health", (req, res) => {
    res.json({ status: "OK" });
});

// Healthcheck REAL de DB
app.get("/db-health", async (req, res) => {
    try {
        const result = await pool.query("SELECT 1");
        res.json({
            status: "OK",
            db: "connected",
            result: result.rows,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "ERROR",
            db: "disconnected",
        });
    }
});


// ==========================
// GET all entries
// ==========================
app.get("/entries", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM entries ORDER BY created_at DESC"
        );
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

// ==========================
// CREATE new entry
// ==========================
app.post("/entries", async (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO entries (title, description) VALUES ($1, $2) RETURNING *",
            [title, description]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});


app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
