const express = require('express');
const mysql = require('mysql');
const path = require('path');
const userRoutes = require('./routes/userRoutes.js');
const dashboardRoutes = require('./routes/dashboardRoutes.js'); 
const votingRoutes = require('./routes/votingRoutes.js'); 
const questionRoutes = require('./routes/aqRoutes.js'); // Подключаем роутер для пользователей
const crypto = require('node:crypto');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Добавляем middleware для обслуживания статических файлов из папки public

// Routes
app.use('/api/users', userRoutes); // Используем роутер для пользователей
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/voting', votingRoutes); 
app.use('/api/questions', questionRoutes);// Используем роутер для пользователей


// Генерация ключей
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
    }
});

// Маршрут для предоставления публичного ключа клиенту
app.get('/public-key', (req, res) => {
    res.send(publicKey);
});

// Connect to MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'voting_system'
});

db.connect((err) => {
    if (err) {
        console.error('Failed to connect to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
    // Start server
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
