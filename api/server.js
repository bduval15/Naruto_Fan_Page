const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "..", "public")));

// Function to read JSON files safely
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

// Serve HTML page index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// Serve Article Pages
[1, 2, 3, 4].forEach(num => {
    app.get(`/article${num}`, (req, res) => {
        res.sendFile(path.join(__dirname, "..", "app", "data", `article${num}.html`));
    });
});

// Serve JSON Files Dynamically (Fix for JSON not loading)
app.get("/data/:filename", async (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, "..", "app", "data", `${fileName}.json`);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
    }

    try {
        const data = await readJSON(filePath);
        res.json(data);
    } catch (error) {
        console.error(`Error fetching JSON data: ${fileName}`, error);
        res.status(500).json({ error: "Error reading JSON data" });
    }
});

// Fetch Middle Section Data from JSON
app.get("/data/middle", async (req, res) => {
    try {
        const dataPath = path.join(__dirname, "..", "app", "data", "data.json");
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
        const dataPath = path.join(__dirname, "..", "app", "data", "cat.json");
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

// Fetch Images from JSON
app.get('/data/images', async (req, res) => {
    try {
        const dataPath = path.join(__dirname, "..", "app", "data", "images.json");
        const data = await readJSON(dataPath);
        res.json(data);
    } catch (error) {
        console.error('Error reading images JSON:', error);
        res.status(500).json({ error: "Error reading images data" });
    }
});

// Handle 404 Errors
app.use((req, res) => {
    res.status(404).json({ error: "Page not found" });
});

// Export the Express app for Vercel
module.exports = app;
