const express = require('express');
const { makeVote } = require('../controllers/VoteController.js'); // Подключаем контроллеры для пользователей

const router = express.Router();

// Роуты для пользователей
router.post('/vote', makeVote);


module.exports = router;