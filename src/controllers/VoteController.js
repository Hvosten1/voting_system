const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const crypto = require('node:crypto');

// Создаем подключение к базе данных
const db = require("../models/db")

const connection = db

const privateKeyDir='C:/Users/dogre/Documents/voting_system/src/private_key.pem'

// Функция для принятия и формирования голоса избирателя
const makeVote = (req, res) => {
    //const { votingId, userId, candidateId, userCode } = req.body;
    const { encryptedFirstData, encryptedSecondData, encryptedThirdData, encryptedFourData } = req.body;
    

    const privateKey = fs.readFileSync(privateKeyDir, 'utf8');
  
    const decrypt = (encryptedData) => {
      return crypto.privateDecrypt(
        {
          key: privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        Buffer.from(encryptedData, 'base64')
      ).toString('utf8');
    };
  
    try {
      const votingId = decrypt(encryptedFirstData);
      const userId = decrypt(encryptedSecondData);
      const candidateId = decrypt(encryptedThirdData);
      const userCode = decrypt(encryptedFourData);

      //const votingId = encryptedVotingId;
      //const userId = encryptedUserId;
      //const candidateId = encryptedCandidateId;
      //const userCode = encryptedUserCode;

  
      // Записываем голос в таблицу votes
      const insertVoteSql = `INSERT INTO votes (voting_id, user_key) VALUES (?, ?)`;
      db.query(insertVoteSql, [votingId, userCode], (err, result) => {
        if (err) {
          console.error('Error inserting vote:', err);
          res.status(500).json({ message: 'Internal Server Error' });
          return;
        }
  
        // Обновляем запись в таблице voting_participants
        const updateParticipantSql = `UPDATE voting_participants SET voted = 1 WHERE voting_id = ? AND user_id = ?`;
        db.query(updateParticipantSql, [votingId, userId], (err, result) => {
          if (err) {
            console.error('Error updating participant:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
          }
  
          // Увеличиваем количество голосов в таблице voting_options
          const updateOptionSql = `UPDATE voting_options SET votes = votes + 1 WHERE voting_id = ? AND v_option = ?`;
          db.query(updateOptionSql, [votingId, candidateId], (err, result) => {
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
    } catch (err) {
      console.error('Error decrypting data:', err);
      res.status(500).json({ message: 'Error decrypting data' });
    }
  };


module.exports = { makeVote };