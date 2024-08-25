const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Setup CORS
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'shop'
});

db.connect(err => {
    if (err) throw err;
    console.log('Database connected');
});

// Endpoint to get all products
app.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Endpoint to get a product by ID
app.get('/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});

// Endpoint to add a new product
app.post('/products', (req, res) => {
    const { name, image, price, description } = req.body;
    const query = 'INSERT INTO products (name, image, price, description) VALUES (?, ?, ?, ?)';
    db.query(query, [name, image, price, description], (err, results) => {
        if (err) throw err;
        res.json({ id: results.insertId, name, image, price, description });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
