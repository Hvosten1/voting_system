// src/routes/dashboardRoutes.js

const { getVotings, createVoting, deleteVoting, getVotingsForUser, getCandidatesForVoting, getParticipatedVotings } = require('../controllers/DashboardController.js');

const express = require('express');
const router = express.Router();

router.get('/list', getVotings);
router.post('/create', createVoting);
router.post('/delete', deleteVoting);
router.get('/votingsForUser/:userId', getVotingsForUser);
router.get('/candidates/:votingId', getCandidatesForVoting);
router.get('/participated/:userId', getParticipatedVotings);



module.exports = router;
