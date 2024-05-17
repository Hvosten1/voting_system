const mysql = require('mysql');
const bcrypt = require('bcrypt');
const db = require("../models/db")

const connection = db



const registerUser = (req, res) => {
  const { username, email, password, firstname, surname, thirdname } = req.body;
  
  // Проверяем, не используется ли уже указанное имя пользователя
  connection.query('SELECT * FROM users WHERE username = ?', [username], (err, rows) => {
      if (err) {
          console.error('Error checking username:', err);
          res.status(500).json({ message: 'Internal Server Error' });
          return;
      }
      
      if (rows.length > 0) {
          res.status(400).json({ message: 'Этот логин уже используется' });
          return;
      }

      // Проверяем, не используется ли уже указанный адрес электронной почты
      connection.query('SELECT * FROM users WHERE email = ?', [email], (err, rows) => {
          if (err) {
              console.error('Error checking email:', err);
              res.status(500).json({ message: 'Internal Server Error' });
              return;
          }
          
          if (rows.length > 0) {
              res.status(400).json({ message: 'Этот адрес электронной почты уже используется' });
              return;
          }

          // Хешируем пароль
          bcrypt.hash(password, 10, (err, hash) => {
              if (err) {
                  console.error('Error hashing password:', err);
                  res.status(500).json({ message: 'Internal Server Error' });
                  return;
              }
              
              // Вставляем нового пользователя в базу данных
              const sql = `INSERT INTO users (username, email, password, firstname, surname, thirdname) VALUES (?, ?, ?, ?, ?, ?)`;
              connection.query(sql, [username, email, hash, firstname, surname, thirdname], (err, result) => {
                  if (err) {
                      console.error('Error registering user:', err);
                      res.status(500).json({ message: 'Такие данные уже используются в системе' });
                      return;
                  }
                  
                  res.cookie('role', 'user', { httpOnly: false });
                  res.cookie('id', result.insertId, { httpOnly: false });
                  
                  console.log('User registered successfully');
                  res.status(201).json({ message: 'User registered successfully' });
              });
          });
      });
  });
};


const loginUser = (req, res) => {
  const { username, password } = req.body;
  // Запрос на поиск пользователя по 
  const sql = `SELECT * FROM users WHERE username = ?`;
  connection.query(sql, [username], (err, results) => {
    if (err) {
      console.error('Error logging in:', err);
      res.status(500).json({ message: 'Internal Server Error' });
      return;
    }
    if (results.length === 0) {
      console.log('User not found');
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const user = results[0];
    // Сравниваем введенный пароль с хешем пароля из базы данных
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        res.status(500).json({ message: 'Internal Server Error' });
        return;
      }
      if (!isMatch) {
        console.log('Invalid password');
        res.status(401).json({ message: 'Invalid password' });
        return;
      }
      res.cookie('role', user.role, { httpOnly: false});
      res.cookie('id', user.id, { httpOnly: false});

      console.log('Login successful');
      res.status(200).json({ message: 'Login successful' });
    });
  });
};




// Получение роли пользователя из cookies
const getUsers = (req, res) => {
  const sql = `SELECT * FROM users`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ message: 'Internal Server Error' });
      return;
    }
    res.status(200).json(results);
  });
};

const searchBlockchain = (req, res) => {
  const secretKey  = req.params.secretKey;
  console.log(secretKey);

  // Выполняем SQL-запрос для поиска блока по секретному ключу
  const query = `SELECT * FROM blockchain WHERE data LIKE '%${secretKey};%' LIMIT 1`;

  connection.query(query, (error, results, fields) => {
    if (error) {
      console.error('Ошибка выполнения запроса: ' + error.message);
      res.status(500).json({ message: 'Internal Server Error' });
      return;
    }
    if (results.length > 0) {
      //console.log('Найденный блок:', results[0]);
      res.status(200).json(results[0]);
    } else {
      console.log('Блок с указанным секретным ключом не найден.');
      res.status(404).json({ message: 'Блок с указанным секретным ключом не найден' });
    }
  });
};


module.exports = { registerUser, loginUser, getUsers, searchBlockchain};

