const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, "..", "public")));

// Correct JSON file path handling
app.get("/data/:filename", async (req, res) => {
    const jsonFile = `${req.params.filename}.json`;
    const filePath = path.join(__dirname, "..", "app", "data", jsonFile);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
    }

    try {
        const data = await fs.promises.readFile(filePath, "utf8");
        res.setHeader("Content-Type", "application/json");
        res.json(JSON.parse(data));
    } catch (error) {
        console.error(`Error reading JSON file: ${filePath}`, error);
        res.status(500).json({ error: "Error reading JSON data" });
    }
});

// Serve home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({ error: "Page not found" });
});

// Export Express app for Vercel
module.exports = app;
