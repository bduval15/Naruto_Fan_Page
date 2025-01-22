const express = require("express");
const app = express();
const path = require("path");

// Serve static files
app.use("/js", express.static(path.join(process.cwd(), "public", "js")));
app.use("/css", express.static(path.join(process.cwd(), "public", "css")));
app.use("/img", express.static(path.join(process.cwd(), "public", "img")));
app.use("/data", express.static(path.join(process.cwd(), "public", "data"))); // ✅ This serves all JSON files

// Serve homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// Serve article files
[1, 2, 3, 4].forEach(num => {
    app.get(`/article${num}`, (req, res) => {
        res.sendFile(path.join(process.cwd(), "public", "data", `article${num}.html`));
    });
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({ error: "Page not found" });
});

// Export Express app for Vercel
module.exports = app;
