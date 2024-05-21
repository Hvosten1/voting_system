const mysql = require('mysql');

const db = require("../models/db")

const connection = db

// Функция для получения списка всех голосований
const getVotings = (req, res) => {
  const sql = `SELECT * FROM votings`;
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error getting votings:', err);
      res.status(500).json({ message: 'Internal Server Error' });
      return;
    }
    console.log('Votings retrieved successfully');
    res.status(200).json(results);
  });
};

// Функция для создания нового голосования
const createVoting = (req, res) => {
  const { title, options, startDate, endDate, participants } = req.body;

  // Добавляем голосование в базу данных
  const sql = `INSERT INTO votings (title,  start_date, end_date) VALUES (?, ?, ?)`;
  connection.query(sql, [title, startDate, endDate], (err, result) => {
     
      
      const voteId = result.insertId;

      Promise.all([
        // Запрос на добавление участников
        new Promise((resolve, reject) => {
          if (participants && participants.length > 0) {
            const values = participants.map(userId => [voteId, userId]);
            const participantSql = `INSERT INTO voting_participants (voting_id, user_id) VALUES ?`;
            connection.query(participantSql, [values], (err, result) => {
              if (err) {
                console.error('Error adding participants to vote:', err);
                reject(err);
                return;
              }
              resolve();
            });
          } else {
            resolve();
          }
        }),
        // Запрос на добавление вариантов голосования
        new Promise((resolve, reject) => {
          if (options && options.length > 0) {
            const optionValues = options.map(option => [voteId, option, 0]); // добавление 0 для количества голосов
            const optionSql = `INSERT INTO voting_options (voting_id, v_option, votes) VALUES ?`;
            connection.query(optionSql, [optionValues], (err, result) => {
              if (err) {
                console.error('Error adding options to vote:', err);
                reject(err);
                return;
              }
              resolve();
            });
          } else {
            resolve();
          }
        })
      ])
      .then(() => {
        res.status(201).json({ message: 'Vote created successfully', id:result.insertId }); // Отправить ответ только после успешного выполнения всех запросов
      })
      .catch(error => {
        console.error('Error creating vote:', error);
        res.status(500).json({ message: 'Internal Server Error' }); // Отправить ошибку сервера в случае возникновения ошибки
      });
  });
};

// Функция для удаления голосования по его идентификатору
const deleteVoting = (req, res) => {
  const votingId = req.params.id;
  const sql = `DELETE FROM votings WHERE id = ?`;
  connection.query(sql, [votingId], (err, result) => {
    if (err) {
      console.error('Error deleting voting:', err);
      res.status(500).json({ message: 'Internal Server Error' });
      return;
    }
    console.log('Voting deleted successfully');
    res.status(200).json({ message: 'Voting deleted successfully' });
  });
};

const getVotingsForUser = (req, res) => {
  const userId = req.params.userId;
    const sql = `
      SELECT v.*
      FROM votings v
      JOIN voting_participants vp ON v.id = vp.voting_id
      WHERE vp.user_id = ? and vp.voted = 0;
    `;
  connection.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Error getting votings for user voting:', err);
      res.status(500).json({ message: 'Internal Server Error' });
      return;
    }
    console.log('Voting delivered successfully');
    res.status(200).json( result );
  });
};


const getCandidatesForVoting = (req, res) => {
  const votingId = req.params.votingId;
  const sql = `
    SELECT *
    FROM voting_options
    WHERE voting_id = ?;
  `;
  connection.query(sql, [votingId], (err, results) => {
    if (err) {
      console.error('Error getting candidates for voting:', err);
      res.status(500).json({ message: 'Internal Server Error' });
      return;
    }
    console.log('Candidates for voting retrieved successfully');
    res.status(200).json(results);
  });
};

// Функция для получения списка голосований, в которых пользователь участвовал, и их результатов
const getParticipatedVotings = (req, res) => {
  // Получаем идентификатор пользователя из запроса
  const userId = req.params.userId;

  // Запрос к базе данных для получения списка голосований, в которых пользователь участвовал, и их результатов
  const sql = `
  SELECT v.*
  FROM votings v
  JOIN voting_participants vp ON v.id = vp.voting_id
  WHERE vp.user_id = ? and vp.voted = 1;
`;
  connection.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error getting participated votings:', err);
      res.status(500).json({ message: 'Internal Server Error' });
      return;
    }
    console.log('Participated votings retrieved successfully');
    res.status(200).json(results);
  });
};






module.exports = { getVotings, createVoting, deleteVoting, getVotingsForUser, getCandidatesForVoting, getParticipatedVotings };
