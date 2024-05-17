const mysql = require('mysql');

// Создаем подключение к базе данных
const db = require("../models/db")

const connection = db


const makeVote = (req, res) => {
  const { votingId, userId, candidateId, userCode } = req.body;

  // Записываем голос в таблицу votes
  const insertVoteSql = `INSERT INTO votes (voting_id, user_key) VALUES (?, ?)`;
  connection.query(insertVoteSql, [votingId, userCode], (err, result) => {
      if (err) {
          console.error('Error inserting vote:', err);
          res.status(500).json({ message: 'Internal Server Error' });
          return;
      }

      // Обновляем запись в таблице voting_participants
      const updateParticipantSql = `UPDATE voting_participants SET voted = 1 WHERE voting_id = ? AND user_id = ?`;
      connection.query(updateParticipantSql, [votingId, userId], (err, result) => {
          if (err) {
              console.error('Error updating participant:', err);
              res.status(500).json({ message: 'Internal Server Error' });
              return;
          }

          // Увеличиваем количество голосов в таблице voting_options
          const updateOptionSql = `UPDATE voting_options SET votes = votes + 1 WHERE voting_id = ? AND v_option = ?`;
          connection.query(updateOptionSql, [votingId, candidateId], (err, result) => {
              if (err) {
                  console.error('Error updating option:', err);
                  res.status(500).json({ message: 'Internal Server Error' });
                  return;
              }

              console.log('Vote submitted successfully');
              res.status(200).json({ message: 'Vote submitted successfully' });
          });
      });
  });
  };


module.exports = { makeVote };