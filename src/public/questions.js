const setupAdminQuestions = async (container) => {
    const questionsContainer = document.createElement('div');
    container.appendChild(questionsContainer);

    try {
        const response = await fetch('/api/questions/list');
        const questions = await response.json();
        renderQuestions(questions, questionsContainer, true); // Передаем true, чтобы показывать кнопку "Ответить"
    } catch (error) {
        console.error('Error loading all questions:', error);
    }
};

const setupUserQuestions = async (userId, container) => {
    const questionsContainer = document.createElement('div');
    questionsContainer.classList.add('question-container'); // Добавляем класс для контейнера вопросов
    container.appendChild(questionsContainer);

    // Добавляем форму для создания вопроса
    const createQuestionForm = document.createElement('form');
    createQuestionForm.classList.add('create-question-form'); // Добавляем класс для формы создания вопроса
    createQuestionForm.innerHTML = `
        <textarea id="questionText" class="question-input" placeholder="Введите ваш вопрос"></textarea>
        <button type="submit" class="submit-question-button">Задать вопрос</button>
    `;
    questionsContainer.appendChild(createQuestionForm);

    // Обработчик события для отправки формы создания вопроса
    createQuestionForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const questionText = document.getElementById('questionText').value;
        await sendQuestion(userId, questionText);
        // После отправки вопроса перезагружаем список вопросов пользователя
        location.reload();
    });

    try {
        const response = await fetch(`/api/questions/questionsForUser/${userId}`);
        const questions = await response.json();
        renderQuestions(questions, questionsContainer, false); // Передаем false, чтобы не показывать кнопку "Ответить"
    } catch (error) {
        console.error('Error loading user questions:', error);
    }
};

const renderQuestions = (questions, container, showAnswerButton) => {
    questions.forEach(question => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question'); // Добавляем класс для вопроса

        const questionText = document.createElement('div');
        questionText.classList.add('question-text'); // Добавляем класс для текста вопроса
        questionText.textContent = question.question;
        questionElement.appendChild(questionText);

        if (question.answer) {
            const answerElement = document.createElement('div');
            answerElement.classList.add('answer'); // Добавляем класс для ответа
            answerElement.textContent = `Ответ: ${question.answer}`;
            questionElement.appendChild(answerElement);
        }

        if (showAnswerButton && question.answer === null) {
            const answerButton = document.createElement('button');
            answerButton.classList.add('answer-button'); // Добавляем класс для кнопки ответа
            answerButton.textContent = 'Ответить';
            questionElement.appendChild(answerButton);

            // Создаем форму для ввода ответа
            const answerForm = document.createElement('form');
            answerForm.classList.add('answer-form'); // Добавляем класс для формы ответа
            answerForm.style.display = 'none'; // Скрываем форму по умолчанию

            const answerInput = document.createElement('textarea');
            answerInput.classList.add('answer-input'); // Добавляем класс для поля ввода ответа
            answerInput.setAttribute('name', 'answer');

            const submitAnswerButton = document.createElement('button');
            submitAnswerButton.textContent = 'Отправить';
            submitAnswerButton.classList.add('submit-answer-button');

            answerForm.appendChild(answerInput);
            answerForm.appendChild(submitAnswerButton);
            questionElement.appendChild(answerForm);

            // Добавляем обработчик события для кнопки "Ответить"
            answerButton.addEventListener('click', () => {
                answerForm.style.display = 'block'; // Отображаем форму при нажатии на кнопку "Ответить"
            });

            // Добавляем обработчик события для отправки формы ответа на вопрос
            answerForm.addEventListener('submit', async (event) => {
                event.preventDefault();
                
                const answer = answerInput.value;
                const questionId = question.id

                // Отправляем ответ на сервер
                try {
                    const response = await fetch(`/api/questions/sendA`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ questionId, answer })
                    });

                    if (!response.ok) {
                        throw new Error('Failed to send answer');
                    }

                    console.log('Answer sent successfully');
                    // Очищаем контейнер вопросов и перезагружаем их
                    container.innerHTML = '';
                    setupAdminQuestions(container);

                } catch (error) {
                    console.error('Error sending answer:', error);
                }
            });
        }

        container.appendChild(questionElement);
    });
};



const loadUserQuestions = async (userId, container) => {
    try {
        const response = await fetch(`/api/questions/questionsForUser/${userId}`);
        const questions = await response.json();
        renderQuestions(questions, container, false); // Передаем false, чтобы не показывать кнопку "Ответить"
    } catch (error) {
        console.error('Error loading user questions:', error);
    }
};

const loadAllQuestions = async (container) => {
    try {
        const response = await fetch('/api/questions/list');
        const questions = await response.json();
        renderQuestions(questions, container, true); // Передаем true, чтобы показывать кнопку "Ответить"
    } catch (error) {
        console.error('Error loading all questions:', error);
    }
};



const sendQuestion = async (userId, question) => {
    try {
        const response = await fetch('/api/questions/sendQ', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, question })
        });
        if (!response.ok) {
            throw new Error('Failed to send question');
        }
    } catch (error) {
        console.error('Error sending question:', error);
    }
};

const sendAnswer = async (questionId, answer) => {
    try {
        const response = await fetch('/api/questions/sendA', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ questionId, answer })
        });
        if (!response.ok) {
            throw new Error('Failed to send answer');
        }
    } catch (error) {
        console.error('Error sending answer:', error);
    }
};