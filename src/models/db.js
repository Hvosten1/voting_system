const mysql = require('mysql');

// Создаем соединение с базой данных MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'voting_system'
});

// Подключаемся к базе данных
db.connect((err) => {
    if (err) {
        console.error('Failed to connect to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Экспортируем соединение с базой данных
module.exports = db;
