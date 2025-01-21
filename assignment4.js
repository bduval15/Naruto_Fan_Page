const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const mysql = require("mysql");

app.use("/js", express.static(path.join(__dirname, 'public', 'js')));
app.use("/css", express.static(path.join(__dirname, 'public', 'css')));
app.use("/img", express.static(path.join(__dirname, 'public', 'img')));
app.use("/data", express.static(path.join(__dirname, 'app', 'data')));

app.get("/", function (req, res) {
    let doc = fs.readFileSync(path.join(__dirname, 'app', 'html', 'index.html'), 'utf8');
    res.send(doc);
});

app.get("/profile", function (req, res) {
    let doc = fs.readFileSync(path.join(__dirname, 'app', 'html', 'profile.html'), 'utf8');
    res.send(doc);
});

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

db.connect(err => {
    if (err) {
        console.error("Error connecting to the database:", err);
        process.exit(1);
    } else {
        console.log("Connected to MySQL database.");
    }
});

// Articles
app.get('/article1', (req, res) => {
    const articlePath = path.join(__dirname, 'app', 'data', 'article1.html');
    fs.readFile(articlePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading Article 1:', err);
            res.status(500).send('Error reading Article 1');
            return;
        }
        res.send(data);
    });
});

app.get('/article2', (req, res) => {
    const articlePath = path.join(__dirname, 'app', 'data', 'article2.html');
    fs.readFile(articlePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading Article 2:', err);
            res.status(500).send('Error reading Article 2');
            return;
        }
        res.send(data);
    });
});

app.get('/article3', (req, res) => {
    const articlePath = path.join(__dirname, 'app', 'data', 'article3.html');
    fs.readFile(articlePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading Article 3:', err);
            res.status(500).send('Error reading Article 3');
            return;
        }
        res.send(data);
    });
});

app.get('/article4', (req, res) => {
    const articlePath = path.join(__dirname, 'app', 'data', 'article4.html');
    fs.readFile(articlePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading Article 4:', err);
            res.status(500).send('Error reading Article 4');
            return;
        }
        res.send(data);
    });
});

// MySQL Database Fetch
app.get("/data/middle", (req, res) => {
    const query = `
        SELECT c.name AS category, GROUP_CONCAT(a.value) AS attributes
        FROM categories c
        LEFT JOIN attributes a ON c.id = a.category_id
        WHERE c.name IN ('Jutsu', 'Clans', 'Rivals', 'Legends', 'Villages')
        GROUP BY c.id;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching middle data:", err);
            res.status(500).send("Error fetching middle data");
            return;
        }
        const middleData = {};
        results.forEach(row => {
            middleData[row.category] = row.attributes ? row.attributes.split(",") : [];
        });
        res.json(middleData);
    });
});

app.get("/data/sidebar", (req, res) => {
    const query = `
        SELECT c.name AS category, GROUP_CONCAT(a.value) AS attributes
        FROM categories c
        LEFT JOIN attributes a ON c.id = a.category_id
        WHERE c.name IN ('Manga', 'Anime', 'Art', 'Shop', 'Login')
        GROUP BY c.id;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching sidebar data:", err);
            res.status(500).send("Error fetching sidebar data");
            return;
        }
        const sidebarData = {};
        results.forEach(row => {
            sidebarData[row.category] = row.attributes ? row.attributes.split(",") : [];
        });
        res.json(sidebarData);
    });
});


app.get('/data/images', (req, res) => {
    const dataPath = path.join(__dirname, 'app', 'data', 'images.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON data:', err);
            res.status(500).send('Error reading JSON data');
            return;
        }
        res.json(JSON.parse(data)); 
    });
});

// Port
app.use(function (req, res, next) {
    res.status(404).send("<html><head><title>Page not found!</title></head><body><p>Nothing here.</p></body></html>");
});

let port = 8000;
app.listen(port, function () {
    console.log("Server listening on port " + port + "!");
});
