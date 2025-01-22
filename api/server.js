const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

// Serve static files
app.use("/js", express.static(path.join(process.cwd(), "public", "js")));
app.use("/css", express.static(path.join(process.cwd(), "public", "css")));
app.use("/img", express.static(path.join(process.cwd(), "public", "img")));
app.use("/data", express.static(path.join(process.cwd(), "public", "data"))); // Updated path

// Function to read JSON data
const readJSON = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
};

// Serve HTML files
app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// Serve article files
[1, 2, 3, 4].forEach(num => {
    app.get(`/article${num}`, (req, res) => {
        res.sendFile(path.join(process.cwd(), "public", "data", `article${num}.html`));
    });
});

// Fetch Middle Section Data from JSON
app.get("/data/middle", async (req, res) => {
    try {
        const dataPath = path.join(process.cwd(), "public", "data", "data.json"); 
        const data = await readJSON(dataPath);
        const middleCategories = ["Jutsu", "Clans", "Rivals", "Legends", "Villages"];
        let middleData = {};
        middleCategories.forEach(category => {
            middleData[category] = data[category] || [];
        });
        res.json(middleData);
    } catch (error) {
        console.error("Error fetching middle data:", error);
        res.status(500).json({ error: "Error reading middle data" });
    }
});

// Fetch Sidebar Section Data from JSON
app.get("/data/sidebar", async (req, res) => {
    try {
        const dataPath = path.join(process.cwd(), "public", "data", "cat.json"); 
        const data = await readJSON(dataPath);
        const sidebarCategories = ["Manga", "Anime", "Art", "Shop", "Login"];
        let sidebarData = {};
        sidebarCategories.forEach(category => {
            sidebarData[category] = data[category] || [];
        });
        res.json(sidebarData);
    } catch (error) {
        console.error("Error fetching sidebar data:", error);
        res.status(500).json({ error: "Error reading sidebar data" });
    }
});

// Fetch images from JSON
app.get("/data/images", async (req, res) => {
    try {
        const dataPath = path.join(process.cwd(), "public", "data", "images.json"); // Fixed path
        const data = await readJSON(dataPath);
        res.json(data);
    } catch (error) {
        console.error("Error reading images JSON:", error);
        res.status(500).json({ error: "Error reading images data" });
    }
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({ error: "Page not found" });
});

// Export Express app for Vercel
module.exports = app;
