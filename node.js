const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'projek_1'
});

// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

// Create a table to store temperature data
const createTableQuery = `CREATE TABLE IF NOT EXISTS temperature_data (
  id INT AUTO_INCREMENT,
  date DATE,
  time TIME,
  temperature DECIMAL(5, 2),
  status VARCHAR(10),
  PRIMARY KEY (id)
)`;
db.query(createTableQuery, (err, results) => {
  if (err) {
    console.error('Error creating table:', err);
    return;
  }
  console.log('Table created successfully');
});

// Define routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/update-status', (req, res) => {
  const { status } = req.body;
  const query = `INSERT INTO temperature_data (date, time, temperature, status) VALUES (NOW(), NOW(), ?, ?)`;
  db.query(query, [req.body.temperature, status], (err, results) => {
    if (err) {
      console.error('Error updating database:', err);
      res.status(500).send('Error updating database');
      return;
    }
    res.send('Status updated successfully');
  });
});

app.get('/get-data', (req, res) => {
  const query = `SELECT * FROM temperature_data`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving data:', err);
      res.status(500).send('Error retrieving data');
      return;
    }
    res.json(results);
  });
});

// Start server
const port = 3400;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
