const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const errorMessage = document.getElementById('errorMessage');

        const loginButton = document.getElementById('loginButton');
        const registerButton = document.getElementById('registerButton');
        const registerSwitch = document.getElementById('registerSwitch');
        const loginSwitch = document.getElementById('loginSwitch');

        loginButton.addEventListener('click', async () => {
            const loginUsername = document.getElementById('loginUsername').value;
            const loginPassword = document.getElementById('loginPassword').value;

            try {
                const response = await fetch('/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: loginUsername, password: loginPassword })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    errorMessage.textContent = errorData.message;
                    errorMessage.style.display = 'block';
                    return;
                }
                // После успешного входа
                document.cookie = "loggedIn=true; path=/"; // Устанавливаем куки с ключом loggedIn и значением true

                window.location.href = './dashboard.html'; // Redirect to dashboard on successful login
            } catch (error) {
                console.error('Error:', error);
                errorMessage.textContent = 'An error occurred';
                errorMessage.style.display = 'block';
            }
        });

        registerButton.addEventListener('click', async () => {
            const registerUsername = document.getElementById('registerUsername').value;
            const registerEmail = document.getElementById('registerEmail').value;
            const registerPassword = document.getElementById('registerPassword').value;
            const registerFirstname = document.getElementById('registerFirstname').value;
            const registerSurname = document.getElementById('registerSurname').value;
            const registerThirdname = document.getElementById('registerThirdname').value;

            try {
                const response = await fetch('/api/users/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username: registerUsername, email: registerEmail, password: registerPassword, firstname: registerFirstname, surname: registerSurname, thirdname: registerThirdname })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    errorMessage.textContent = errorData.message;
                    errorMessage.style.display = 'block';
                    return;
                }
                document.cookie = "loggedIn=true; path=/"; // Устанавливаем куки с ключом loggedIn и значением true
                window.location.href = './dashboard.html'; // Redirect to dashboard on successful registration
            } catch (error) {
                console.error('Error:', error);
                errorMessage.textContent = 'An error occurred';
                errorMessage.style.display = 'block';
            }
        });

        registerSwitch.addEventListener('click', () => {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            errorMessage.style.display = 'none';
        });

        loginSwitch.addEventListener('click', () => {
            registerForm.style.display = 'none';
            loginForm.style.display = 'block';
            errorMessage.style.display = 'none';
        });