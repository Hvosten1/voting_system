const express = require('express');
const { registerUser, loginUser, getUsers, searchBlockchain } = require('../controllers/UserController.js'); // Подключаем контроллеры для пользователей

const router = express.Router();

// Роуты для пользователей
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/list', getUsers);
router.get('/blockchain/:secretKey', searchBlockchain );


module.exports = router;
