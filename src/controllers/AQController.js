const mysql = require('mysql');

const db = require("../models/db")

const connection = db



const sendQuestion = (req, res) => {
    const { userId, question } = req.body;

    // Проверка наличия необходимых данных
    if (!userId || !question) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Запрос к базе данных для добавления вопроса
    const sql = 'INSERT INTO questions (user_id, question) VALUES (?, ?)';
    connection.query(sql, [userId, question], (err, result) => {
        if (err) {
            console.error('Error sending question:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        console.log('Question sent successfully');
        res.status(200).json({ message: 'Question sent successfully' });
    });
};

// Функция для получения всех вопросов (администратор)
const getAllQuestions = (req, res) => {
    // Запрос к базе данных для получения всех вопросов
    const sql = 'SELECT * FROM questions';
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error getting questions:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        console.log('Questions retrieved successfully');
        res.status(200).json(results);
    });
};

const answerQuestion = (req, res) => {
    const questionId = req.body.questionId;
    const answer = req.body.answer; // Исправление тут

    // Проверка наличия ответа
    if (!answer) {
        return res.status(400).json({ message: 'Missing answer field' });
    }
    console.log(answer)

    // Запрос к базе данных для обновления ответа на вопрос
    const sql = 'UPDATE questions SET answer = ? WHERE id = ?';
    connection.query(sql, [answer, questionId], (err, result) => {
        if (err) {
            console.error('Error answering question:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        console.log('Question answered successfully');
        res.status(200).json({ message: 'Question answered successfully' });
    });
};

// Функция для получения вопросов конкретного пользователя
const getUserQuestions = (req, res) => {
    const userId = req.params.userId;

    // Запрос к базе данных для получения вопросов пользователя
    const sql = 'SELECT * FROM questions WHERE user_id = ?';
    connection.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error getting user questions:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        console.log('User questions retrieved successfully');
        res.status(200).json(results);
    });
};


module.exports = { sendQuestion, getAllQuestions, answerQuestion, getUserQuestions  };
