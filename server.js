const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');
const routes = require('./routes/index');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set up CORS
app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization'
}));

// Set up MySQL connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_DEV
});

// Connect to MySQL
connection.connect(error => {
    if (error) {
        console.error('Error connecting to MySQL:', error);
        return;
    }
    
    console.log('Connected to MySQL database');
});

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use(routes);

// Start server
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));