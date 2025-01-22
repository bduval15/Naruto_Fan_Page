const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// Serve static files from 'public'
app.use(express.static(path.join(__dirname, "..", "public")));

// Function to read JSON files
const readJSON = async (filePath, res) => {
    try {
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "File not found" });
        }
        const data = await fs.promises.readFile(filePath, "utf8");
        res.json(JSON.parse(data));
    } catch (error) {
        console.error(`Error reading JSON file: ${filePath}`, error);
        res.status(500).json({ error: "Error reading JSON data" });
    }
};

// Serve the home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// Serve article pages
[1, 2, 3, 4].forEach(num => {
    app.get(`/article${num}`, (req, res) => {
        const articlePath = path.join(__dirname, "..", "app", "data", `article${num}.html`);
        if (!fs.existsSync(articlePath)) {
            return res.status(404).send("Article not found");
        }
        res.sendFile(articlePath);
    });
});

// Serve JSON files dynamically
app.get("/data/:filename", async (req, res) => {
    const filePath = path.join(__dirname, "..", "app", "data", `${req.params.filename}.json`);
    readJSON(filePath, res);
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({ error: "Page not found" });
});

// Export Express app for Vercel
module.exports = app;
