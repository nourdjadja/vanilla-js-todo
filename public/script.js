document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logout-button');
    const authSection = document.getElementById('auth-section');
    const todoSection = document.getElementById('todo-section');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            alert('Inscription réussie !');
        } else {
            alert('Échec de l\'inscription. Veuillez vérifier les informations saisies.');
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            authSection.style.display = 'none';
            todoSection.style.display = 'block';
            loadTasks();
        } else {
            alert('Échec de la connexion.');
        }
    });

    logoutButton.addEventListener('click', async () => {
        const response = await fetch('/logout', {
            method: 'POST'
        });

        if (response.ok) {
            authSection.style.display = 'block';
            todoSection.style.display = 'none';
        } else {
            alert('Échec de la déconnexion.');
        }
    });

    async function loadTasks() {
        const response = await fetch('/tasks');
        const tasks = await response.json();

        const todoList = document.getElementById('todo-list');
        todoList.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.content;

            const deleteButton = document.createElement('div');
            deleteButton.classList.add('cross');
            deleteButton.onclick = () => deleteTask(task.id);

            li.appendChild(deleteButton);
            todoList.appendChild(li);
        });
    }

    document.getElementById('todo-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = document.getElementById('todo-input').value;

        const response = await fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });

        if (response.ok) {
            loadTasks();
            document.getElementById('todo-input').value = ''; 
        } else {
            alert('Impossible d\'ajouter la tâche.');
        }
    });

    async function deleteTask(taskId) {
        const response = await fetch(`/tasks/${taskId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadTasks();
        } else {
            alert('Échec de la suppression de la tâche.');
        }
    }

    async function checkSession() {
        try {
            const response = await fetch('/check-session');
            if (response.ok) {
                authSection.style.display = 'none';
                todoSection.style.display = 'block';
                loadTasks();
            } else {
                authSection.style.display = 'block';
                todoSection.style.display = 'none';
            }
        } catch (error) {
            console.error('Erreur lors de la vérification de la session :', error);
            authSection.style.display = 'block';
            todoSection.style.display = 'none';
        }
    }
    
    checkSession();
});
