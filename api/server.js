const express = require("express");
const app = express();
const path = require("path");

// Serve static files from 'public'
app.use(express.static(path.join(process.cwd(), "public")));

// Serve homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({ error: "Page not found" });
});

// Export Express app for Vercel
module.exports = app;
