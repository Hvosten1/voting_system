const axios = require('axios');
const crypto = require('node:crypto');
const fs = require('fs');
const { promisify } = require('util');

const baseURL = 'http://localhost:8080'; // Замените на URL вашего сервера

const createUser = async (username, email, password, firstname, surname, thirdname) => {
    try {
        const response = await axios.post(`${baseURL}/api/users/register`, {
            username, email, password, firstname, surname, thirdname
        });
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error.response ? error.response.data : error.message);
    }
};

const createVoting = async (title, startDate, endDate, participants, options) => {
    try {
        const response = await axios.post(`${baseURL}/api/dashboard/create`, {
            title, startDate, endDate, participants, options
        });
        return response.data;
    } catch (error) {
        console.error('Error creating voting:', error.response ? error.response.data : error.message);
    }
};

const vote = async (votingId, userId, candidateId, userCode) => {
    

    try {
        fetch(`${baseURL}/api/voting/vote`, {
            method: 'POST',
            body: JSON.stringify({
                votingId, userId, candidateId, userCode
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then(response => { return response.data;})
        
    } catch (error) {
       // console.error('Error voting:', error.response ? error.response.data : error.message);
    }
};









const generateUsers = async (numUsers) => {
    const users = [];
    for (let i = 0; i < numUsers; i++) {
        const username = `user${i}`;
        const email = `user${i}@test.com`;
        const password = 'password';
        const firstname = `First${i}`;
        const surname = `Last${i}`;
        const thirdname = `Middle${i}`;
        const user = await createUser(username, email, password, firstname, surname, thirdname);
        if (user) users.push(user);
    }
    return users;
};

const generateVotings = async (numVotings, users) => {
    const votings = [];
    for (let i = 0; i < numVotings; i++) {
        const title = `Voting ${i}`;
        const startDate = new Date().toISOString().split('T')[0];
        const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Через неделю
        const participants = users.map(user => user.id);
        const options = ['Option 1', 'Option 2', 'Option 3'];
        const voting = await createVoting(title, startDate, endDate, participants, options);
        if (voting) votings.push(voting);
    }
    return votings;
};

function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

const simulateVoting = async (votings, users) => {
    for (const voting of votings) {
        for (const user of users) {
            const votingId = voting.id;
            let optionId = '1'; // Выбор кандидата, можно рандомизировать
            try {
                const response = await fetch(`${baseURL}/api/dashboard/candidates/${votingId}`);
                const candidatesInfo = await response.json();
                optionId = candidatesInfo[getRandomInRange(0,2)].v_option;
            } catch (error) {
                console.error(`Error loading candidates info for voting ${votingId}:`, error);
            }
            const userCode = `code${user.id}`;
            await vote(voting.id, user.id, optionId, userCode);
        }
    }
};

const loadTest = async () => {
    console.log('Creating users...');
    const users = await generateUsers(1000);
    console.log('Users created:', users.length);
    //console.log(users);

    console.log('Creating votings...');
    const votings = await generateVotings(10, users);
    console.log('Votings created:', votings.length);

    console.log('Simulating voting...');
    await simulateVoting(votings, users);
    console.log('Voting simulation completed');
};

loadTest().catch(console.error);
