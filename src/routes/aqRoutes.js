const { sendQuestion, getAllQuestions, answerQuestion, getUserQuestions  } = require('../controllers/AQController.js');

const express = require('express');
const router = express.Router();

router.get('/list', getAllQuestions);
router.post('/sendQ', sendQuestion);
router.post('/sendA', answerQuestion);
router.get('/questionsForUser/:userId', getUserQuestions);



module.exports = router;