// dashboard.js

document.addEventListener('DOMContentLoaded', async () => {
    // Проверяем, залогинен ли пользователь
    const loggedInCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('loggedIn=true'));
    const questionContainer = document.getElementById('questionContainer');

    // Если куки loggedIn отсутствует, перенаправляем пользователя на страницу входа
    if (!loggedInCookie) {
        window.location.href = "./index.html";
    }

    // Проверяем роль пользователя
    const userRole = getUserRole();
    console.log(userRole)
    if (userRole === 'admin') {
        showAdminTabs();
        // Если пользователь админ, отображаем кнопку создания нового голосования
        document.getElementById('createVoteButton').style.display = 'block';
        await loadVotes();
        setupAdminQuestions(questionContainer);
    }

    // Стилизация кнопок создания голосования
    //document.getElementById('createVoteButton').classList.add('button');
    

    // Стилизация полей создания голосования
    document.querySelectorAll('.inputField').forEach(field => {
    field.classList.add('inputField');
    });

    // Стилизация кнопки выхода
    document.getElementById('logoutButton').classList.add('button');


    // Загружаем список голосований
    
    if (userRole === 'user') {
        const userId = getUserId(); // Получаем идентификатор текущего пользователя
        showUserTabs();
        setupUserQuestions(userId, questionContainer); // Настраиваем вопросы пользователя
    }
    if (userRole === 'user') {
        const userId = getUserId(); // Функция, которая получает идентификатор текущего пользователя (например, из cookie)
        fetch(`/api/dashboard/votingsForUser/${userId}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            renderVotings(data);
            loadParticipatedVotes(); 
            
        })
        .catch(error => {
            console.error('Error fetching votings:', error);
        });
    }
    




});




function renderVotings(votings) {
    const votesContainer = document.getElementById('votesContainer');
    votesContainer.innerHTML = ''; // Очищаем контейнер перед отображением новых голосований

    votings.forEach(voting => {
        const votingCard = createVotingCard(voting);
        votesContainer.appendChild(votingCard);
        
    });
    
}
// Обновленный код функции createVotingCard
function createVotingCard(voting) {
    const card = document.createElement('div');
    card.classList.add('voteCard'); // Применяем класс для стилизации

    const title = document.createElement('div');
    title.classList.add('voteTitle');
    title.textContent = voting.title;

    const dates = document.createElement('div');
    dates.classList.add('voteDates');
    dates.innerHTML = `Начало: ${formatDateString(voting.start_date)}<br>Окончание: ${formatDateString(voting.end_date)}`;

    card.appendChild(title);
    card.appendChild(dates);

    const participateButton = document.createElement('button');
    participateButton.textContent = 'Проголосовать';
    participateButton.classList.add('participateBtn');
    participateButton.addEventListener('click', () => participateInVoting(voting.id, card, participateButton)); // Передаем идентификатор голосования и саму карточку
    card.appendChild(participateButton);

    return card;
}

function generateUniqueCode(length = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    return code;
}


async function fetchPublicKey() {
    const response = await fetch('/public-key');
    const publicKeyPem = await response.text();
    const publicKey = await crypto.subtle.importKey(
      'spki',
      pemToArrayBuffer(publicKeyPem),
      { name: 'RSA-OAEP', hash: { name: 'SHA-256' } },
      false,
      ['encrypt']
    );
    return publicKey;
  }
  
  function pemToArrayBuffer(pem) {
    const base64 = pem.replace(/(-----(BEGIN|END) PUBLIC KEY-----|\n)/g, '');
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
  
  async function encryptData(data, publicKey) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      publicKey,
      encodedData
    );
    return btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
  }






// Обновленный код функции participateInVoting
function participateInVoting(votingId, card, participateButton) {
    const userCode = generateUniqueCode();
    let cand_name = '';
  
    fetchPublicKey()
      .then(publicKey => {
        fetch(`/api/dashboard/candidates/${votingId}`)
          .then(response => response.json())
          .then(candidates => {
            const form = document.createElement('form');
            form.classList.add('voting-form');
  
            candidates.forEach(candidate => {
              const label = document.createElement('label');
              const checkbox = document.createElement('input');
              checkbox.type = 'checkbox';
              checkbox.name = 'candidate';
              checkbox.value = candidate.v_option;
              label.appendChild(checkbox);
              label.appendChild(document.createTextNode(candidate.v_option));
              form.appendChild(label);
              form.appendChild(document.createElement('br'));
            });

            const userCodeLabel = document.createElement('label');
            userCodeLabel.appendChild(document.createTextNode('Уникальный код'));
  
            const userCodeInput = document.createElement('input');
            userCodeInput.type = 'block';
            userCodeInput.name = 'userCode';
            userCodeInput.value = userCode;
  
            const voteButton = document.createElement('button');
            voteButton.textContent = 'Подтвердить';
            
            form.appendChild(userCodeLabel);
  
            form.appendChild(userCodeInput);
            form.appendChild(voteButton);
  
            form.addEventListener('submit', async event => {
              event.preventDefault();
  
              const checkboxes = form.querySelectorAll('input[name="candidate"]:checked');
              const selectedCandidates = Array.from(checkboxes).map(cb => cb.value);
  
              for (let candidate of selectedCandidates) {
                const encryptedFirstData = await encryptData(votingId.toString(), publicKey);
                const encryptedSecondData = await encryptData(getUserId().toString(), publicKey);
                const encryptedThirdData = await encryptData(candidate, publicKey);
                const encryptedFourData = await encryptData(userCode, publicKey);
  
                fetch('/api/voting/vote', {
                  method: 'POST',
                  body: JSON.stringify({
                    encryptedFirstData,
                    encryptedSecondData,
                    encryptedThirdData,
                    encryptedFourData,
                  }),
                  headers: {
                    'Content-Type': 'application/json',
                  },
                })
                  .then(response => {
                    if (response.ok) {
                      console.log('Голос успешно засчитан');
                    } else {
                      console.error('Ошибка при голосовании');
                    }
                  })
                  .catch(error => {
                    console.error('Ошибка при отправке запроса на сервер:', error);
                  });
              }
  
              location.reload();
            });
  
            card.insertBefore(form, participateButton.nextSibling);
          })
          .catch(error => {
            console.error('Ошибка при получении списка кандидатов:', error);
          });
      })
      .catch(error => {
        console.error('Ошибка при получении публичного ключа с сервера:', error);
      });
  }






const loadParticipatedVotes = async () => {
    try {
        const userId = getUserId(); // Получаем идентификатор текущего пользователя
        const response = await fetch(`/api/dashboard/participated/${userId}`);
        const participatedVotes = await response.json();
        const participatedVotesContainer = document.getElementById('participatedVotesContainer');

      

        // Очищаем контейнер перед добавлением новых голосований
        participatedVotesContainer.innerHTML = '';

        // Добавляем каждое голосование, в котором пользователь уже участвовал
        participatedVotes.forEach(vote => {
            const voteElement = document.createElement('div');
            voteElement.classList.add('participatedVoteCard'); // Применяем класс для стилизации
            voteElement.innerHTML = `
              <div class="voteTitle">${vote.title}</div>
              <div class="voteDates">Начало: ${formatDateString(vote.start_date)}<br>Окончание: ${formatDateString(vote.end_date)}</div>
              <div class="candidatesInfo" id="candidatesInfo_${vote.id}" style="display: none;"></div>
              <button class="viewResultsBtn" data-voting-id="${vote.id}">Результаты</button>
            `;
            participatedVotesContainer.appendChild(voteElement);
        });

        // Назначаем обработчик события для кнопок "View Results"
        const viewResultsBtns = document.querySelectorAll('.viewResultsBtn');
        
        viewResultsBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                const votingId = btn.getAttribute('data-voting-id');
                const candidatesInfoContainer = document.getElementById(`candidatesInfo_${votingId}`);
                
                // Проверяем, отображается ли уже информация о кандидатах
                if (candidatesInfoContainer.style.display === 'block') {
                    // Если информация уже отображена, скрываем ее
                    candidatesInfoContainer.style.display = 'none';
                    btn.textContent = "Результаты";
                } else {
                    // Если информации нет, загружаем и отображаем ее
                    await loadCandidatesInfo(votingId);
                    candidatesInfoContainer.style.display = 'block';
                    btn.textContent = "Скрыть";
                }
            });
        });

    } catch (error) {
        console.error('Error loading participated votes:', error);
    }
};














// Обработчик события для кнопки выхода
document.getElementById('logoutButton').addEventListener('click', () => {
    document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
     // Удаляем куки loggedIn
    window.location.href = "./index.html"; // Перенаправляем пользователя на страницу входа
});

// Проверка статуса логина из cookies
const checkLoginStatus = () => {
    const loggedInUser = getLoggedInUser();
    return loggedInUser !== null;
};




// Получение роли пользователя из cookies
const getUserRole = () => {
    const roleCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('role='));
    if (!roleCookie) {
        return null;
    }
    return roleCookie.split('=')[1];
};

const getUserId = () => {
    const idCookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith('id='));
    if (!idCookie) {
        return null;
    }
    return idCookie.split('=')[1];
};



function toggleCreateForm() {
    const createForm = document.getElementById('createForm');
    if (createForm.style.display === 'none') {
        loadUsers();
        createForm.style.display = 'block';
    } else {
        createForm.style.display = 'none';
    }
}


document.getElementById('voteForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Предотвращаем отправку формы по умолчанию
    
    const voteTitle = document.getElementById('voteTitle').value;
    const options = document.getElementById('options').value.split('\n').map(option => option.trim());
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const participants = Array.from(document.getElementById('participants').selectedOptions).map(option => option.value);

    // Отправляем данные на сервер для создания голосования
    try {
        const response = await fetch('/api/dashboard/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: voteTitle, options, startDate, endDate, participants })
        });

        const data = await response.json();
        console.log(data); // Выводим ответ от сервера в консоль

        // Дополнительные действия после успешного создания голосования
        // Например, обновление списка голосований
        await loadVotes();
    } catch (error) {
        console.error('Error:', error);
    }
    toggleCreateForm()
});

const loadUsers = async () => {
    try {
        const response = await fetch('/api/users/list');
        const users = await response.json();
        const participantsSelect = document.getElementById('participants');

        // Очищаем список перед добавлением новых пользователей
        participantsSelect.innerHTML = '';

        // Добавляем каждого пользователя в список
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.firstname + " " + user.surname + " " + user.thirdname;
            participantsSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading users:', error);
    }
};


const formatDateString = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'UTC' };
    return date.toLocaleDateString('en-US', options);
};


const loadVotes = async () => {
    try {
        const response = await fetch('/api/dashboard/list');
        const votes = await response.json();
        const votesContainer = document.getElementById('votesContainer');

        
        // Очищаем контейнер перед добавлением новых голосований
        votesContainer.innerHTML = '';
        

        // Добавляем каждое голосование в контейнер
        votes.forEach(vote => {

            const voteElement = document.createElement('div');
            voteElement.classList.add('voteCard'); // Применяем класс для стилизации
            voteElement.innerHTML = `
              <div class="voteTitle">${vote.title}</div>
              <div class="voteDates">Начало: ${formatDateString(vote.start_date)}<br>Окончание: ${formatDateString(vote.end_date)}</div>
              <div class="voteTitle">Голосующих: ${vote.cnt}</div>
              <button class="showCandidatesBtn" data-voting-id="${vote.id}">Результаты кандидатов</button>
              <div class="candidatesInfo" id="candidatesInfo_${vote.id}"></div>
            `;
            votesContainer.appendChild(voteElement);
           
        });

        // Назначаем обработчик события для кнопок "Show Candidates"
        const showCandidatesBtns = document.querySelectorAll('.showCandidatesBtn');
        showCandidatesBtns.forEach(btn => {
            btn.addEventListener('click', async () => {
                const votingId = btn.getAttribute('data-voting-id');
                const candidatesInfoContainer = document.getElementById(`candidatesInfo_${votingId}`);
                
                // Проверяем, отображается ли уже информация о кандидатах
                if (candidatesInfoContainer.innerHTML.trim() !== '') {
                    // Если информация уже отображена, скрываем ее
                    candidatesInfoContainer.innerHTML = '';
                } else {

                    // Если информации нет, загружаем и отображаем ее
                    await loadCandidatesInfo(votingId);
                }
            });
        });

    } catch (error) {
        console.error('Error loading votes:', error);
    }
};

const loadCandidatesInfo = async (votingId) => {
    try {
        const response = await fetch(`/api/dashboard/candidates/${votingId}`);
        const candidatesInfo = await response.json();
        const candidatesInfoContainer = document.getElementById(`candidatesInfo_${votingId}`);

        // Очищаем контейнер перед добавлением новых данных
        candidatesInfoContainer.innerHTML = '';
        let countCand = 0;

        candidatesInfo.forEach(candidate => {
            countCand+=candidate.votes;
        });
        
        let countProc= ((countCand/candidatesInfoContainer.getAttribute('value'))*100).toFixed(2);

        const candidateCount = document.createElement('div')
        candidateCount.innerHTML=`
         <div>Количество голосов: ${countCand} (${countProc}%)</div>
         <div>------</div>
        `
        candidatesInfoContainer.appendChild(candidateCount);


        // Добавляем информацию о кандидатах в контейнер
        candidatesInfo.forEach(candidate => {
            const candidateElement = document.createElement('div');
            let procent = ((candidate.votes/countCand)*100).toFixed(2);
            candidateElement.innerHTML = `
                <div>Кандидат: ${candidate.v_option}</div>
                <div>Количество голосов: ${candidate.votes}</div>
                <div>Процент: ${procent}%</div>
                <div>------</div>
            `;
            candidatesInfoContainer.appendChild(candidateElement);
        });
    } catch (error) {
        console.error(`Error loading candidates info for voting ${votingId}:`, error);
    }
};


function showUsersList(){
    const usersContainer = document.getElementById('usersContainer');
    usersContainer.innerHTML = '';

    // Получить список пользователей из API
    fetch('/api/users/list')
        .then(response => response.json())
        .then(users => {
            // Добавить каждого пользователя в контейнер
            users.forEach(user => {
                const userElement = document.createElement('div');
                userElement.classList.add('userCard'); // Добавляем класс для стилизации
                userElement.innerHTML = `
                    <div class="userInfo">Имя: ${user.firstname}</div>
                    <div class="userInfo">Фамилия: ${user.surname}</div>
                    <div class="userInfo">Отчество: ${user.thirdname}</div>
                    <div class="userInfo">Email: ${user.email}</div>
                    <div class="userInfo">Роль: ${user.role}</div>
                    <hr>
                `;
                usersContainer.appendChild(userElement);
            });
        })
        .catch(error => {
            console.error('Error loading users:', error);
        });
}





function showAdminTabs() {
    // Создание кнопок для вкладок
    const votesTabButton = document.createElement('button');
    votesTabButton.textContent = 'Голосования';
    votesTabButton.classList.add('button');
    votesTabButton.addEventListener('click', () => {
        document.getElementById('votesContainer').style.display = 'grid';
        document.getElementById('createVoteButton').style.display = 'block';
        document.getElementById('participatedVotesContainer').style.display = 'none';
        document.getElementById('questionContainer').style.display = 'none';
        document.getElementById('voteHeader').style.display = 'block';
        document.getElementById('questionsHeader').style.display = 'none';
        document.getElementById('usersContainer').style.display = 'none';
        document.getElementById('usersHeader').style.display = 'none';
        document.getElementById('blockchainHeader').style.display = 'none';
        document.getElementById('blockchainSearchContainer').style.display = 'none';
    });

    const questionsTabButton = document.createElement('button');
    questionsTabButton.textContent = 'Вопросы';
    questionsTabButton.classList.add('button');
    questionsTabButton.addEventListener('click', () => {
        document.getElementById('votesContainer').style.display = 'none';
        document.getElementById('createVoteButton').style.display = 'none';
        document.getElementById('participatedVotesContainer').style.display = 'none';
        document.getElementById('questionContainer').style.display = 'block';
        document.getElementById('voteHeader').style.display = 'none';
        document.getElementById('questionsHeader').style.display = 'block';
        document.getElementById('usersContainer').style.display = 'none';
        document.getElementById('usersHeader').style.display = 'none';
        document.getElementById('blockchainHeader').style.display = 'none';
        document.getElementById('blockchainSearchContainer').style.display = 'none';
    });

    const usersTabButton = document.createElement('button');
    usersTabButton.textContent = 'Пользователи';
    usersTabButton.classList.add('button');
    usersTabButton.addEventListener('click', () => {
        document.getElementById('votesContainer').style.display = 'none';
        document.getElementById('createVoteButton').style.display = 'none';
        document.getElementById('participatedVotesContainer').style.display = 'none';
        document.getElementById('questionContainer').style.display = 'none';
        document.getElementById('voteHeader').style.display = 'none';
        document.getElementById('questionsHeader').style.display = 'none';
        document.getElementById('usersContainer').style.display = 'grid';
        document.getElementById('usersHeader').style.display = 'block';
        document.getElementById('blockchainHeader').style.display = 'none';
        document.getElementById('blockchainSearchContainer').style.display = 'none';
        showUsersList();

        
    });

    // Добавление кнопок на страницу
    const tabButtonsContainer = document.getElementById('tabs');
    tabButtonsContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых кнопок
    tabButtonsContainer.appendChild(votesTabButton);
    tabButtonsContainer.appendChild(questionsTabButton);
    tabButtonsContainer.appendChild(usersTabButton);

    // Показать первую вкладку по умолчанию
    document.getElementById('votesContainer').style.display = 'grid';
    document.getElementById('createVoteButton').style.display = 'block';
    document.getElementById('questionsHeader').style.display = 'none';
    document.getElementById('participatedVotesContainer').style.display = 'none';
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('blockchainHeader').style.display = 'none';
    document.getElementById('blockchainSearchContainer').style.display = 'none';
    document.getElementById('usersHeader').style.display = 'none';
}

function showUserTabs() {
    // Создание кнопок для вкладок
    const votesTabButton = document.createElement('button');
    votesTabButton.textContent = 'Голосования';
    votesTabButton.classList.add('button');
    votesTabButton.addEventListener('click', () => {
        document.getElementById('votesContainer').style.display = 'grid';
        document.getElementById('participatedVotesContainer').style.display = 'grid';
        document.getElementById('questionContainer').style.display = 'none';
        document.getElementById('blockchainSearchContainer').style.display = 'none';
        document.getElementById('voteHeader').style.display = 'block';
        document.getElementById('questionsHeader').style.display = 'none';
        document.getElementById('usersHeader').style.display = 'none';
        document.getElementById('blockchainHeader').style.display = 'none';
    });

    const questionsTabButton = document.createElement('button');
    questionsTabButton.textContent = 'Вопросы';
    questionsTabButton.classList.add('button');
    questionsTabButton.addEventListener('click', () => {
        document.getElementById('votesContainer').style.display = 'none';
        document.getElementById('participatedVotesContainer').style.display = 'none';
        document.getElementById('questionContainer').style.display = 'block';
        document.getElementById('blockchainSearchContainer').style.display = 'none';
        document.getElementById('voteHeader').style.display = 'none';
        document.getElementById('usersHeader').style.display = 'none';
        document.getElementById('questionsHeader').style.display = 'block';
        document.getElementById('blockchainHeader').style.display = 'none';
    });

    const blockchainTabButton = document.createElement('button');
    blockchainTabButton.textContent = 'Поиск в блокчейне';
    blockchainTabButton.classList.add('button');
    blockchainTabButton.addEventListener('click', () => {
        document.getElementById('votesContainer').style.display = 'none';
        document.getElementById('participatedVotesContainer').style.display = 'none';
        document.getElementById('questionContainer').style.display = 'none';
        document.getElementById('blockchainSearchContainer').style.display = 'block';
        document.getElementById('voteHeader').style.display = 'none';
        document.getElementById('usersHeader').style.display = 'none';
        document.getElementById('questionsHeader').style.display = 'none';
        document.getElementById('blockchainHeader').style.display = 'block';
    });

    // Добавление кнопок на страницу
    const tabButtonsContainer = document.getElementById('tabs');
    tabButtonsContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых кнопок
    tabButtonsContainer.appendChild(votesTabButton);
    tabButtonsContainer.appendChild(questionsTabButton);
    tabButtonsContainer.appendChild(blockchainTabButton);

    // Показать первую вкладку по умолчанию
    document.getElementById('votesContainer').style.display = 'grid';
    document.getElementById('participatedVotesContainer').style.display = 'grid';
    document.getElementById('questionContainer').style.display = 'none';
    
    document.getElementById('voteHeader').style.display = 'block';
    document.getElementById('usersHeader').style.display = 'none';
    document.getElementById('questionsHeader').style.display = 'none';
    document.getElementById('blockchainHeader').style.display = 'none';
    document.getElementById('blockchainSearchContainer').style.display = 'none';
    
}

document.getElementById('searchBlockchainButton').addEventListener('click', () => {
    // Получить значение из поля ввода секретного ключа
    const secretKey = document.getElementById('secretKeyInput').value;

    // Отправить запрос на сервер для поиска блока в блокчейне по секретному ключу
    fetch(`/api/users/blockchain/${secretKey}`)
        .then(response => response.json())
        .then(block => {
            // Вывести информацию о найденном блоке
            console.log(block);
            displayBlockchainInfo(block);
        })
        .catch(error => {
            console.error('Error searching blockchain:', error);
        });
});

function displayBlockchainInfo(block) {
    const blockchainInfoContainer = document.getElementById('blockchainInfoContainer');
    blockchainInfoContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новой информации

    if (block.id!=null) {
        // Если блок найден, создаем элементы для отображения информации о нем
        const blockInfo = document.createElement('div');
        blockInfo.classList.add('block');
        
        const title = document.createElement('h2');
        title.textContent = 'Информация о найденном блоке:';
        blockInfo.appendChild(title);
        
        const id = document.createElement('p');
        id.textContent = `ID блока: ${block.id}`;
        blockInfo.appendChild(id);
        
        const blockHash = document.createElement('p');
        blockHash.textContent = `Хэш блока: ${block.block_hash}`;
        blockInfo.appendChild(blockHash);
        
        const previousHash = document.createElement('p');
        previousHash.textContent = `Предыдущий хэш: ${block.previous_hash}`;
        blockInfo.appendChild(previousHash);
        
        const timestamp = document.createElement('p');
        timestamp.textContent = `Дата создания: ${block.timestamp}`;
        blockInfo.appendChild(timestamp);
        
        const data = document.createElement('p');
        data.textContent = `Данные: ${block.data}`;
        blockInfo.appendChild(data);
        
        // Добавляем сформированный блок с информацией о блоке в контейнер
        blockchainInfoContainer.appendChild(blockInfo);
    } else {
        // Если блок не найден, выводим сообщение об ошибке
        const errorMessage = document.createElement('div');
        errorMessage.textContent = 'Блок с указанным секретным ключом не найден в блокчейне.';
        blockchainInfoContainer.appendChild(errorMessage);
    }
}







