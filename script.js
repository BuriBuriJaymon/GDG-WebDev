document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const taskList = document.getElementById('task-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const fabAddTask = document.getElementById('fab-add-task');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // App State
    let tasks = [];
    let currentFilter = 'all';

    // --- Core Functions ---
    const renderTasks = () => {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'active') return !task.done;
            if (currentFilter === 'completed') return task.done;
            return true;
        });

        if (filteredTasks.length === 0) {
            taskList.innerHTML = `<li class="no-tasks">No tasks pending.</li>`;
            return;
        }

        filteredTasks.forEach(task => {
            const originalIndex = tasks.findIndex(t => t.id === task.id);
            const li = document.createElement('li');
            li.className = task.done ? 'completed' : '';
            li.setAttribute('data-id', task.id);

            const taskText = document.createElement('span');
            taskText.className = 'task-text';
            taskText.textContent = task.text;
            taskText.addEventListener('click', () => toggleTask(originalIndex));

            const actions = document.createElement('div');
            actions.className = 'task-actions';

            const editBtn = document.createElement('button');
            editBtn.textContent = ✏️';
            editBtn.title = 'Edit Task';
            editBtn.addEventListener('click', () => editTask(originalIndex));

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '🗑️';
            deleteBtn.title = 'Delete Task';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTask(originalIndex);
            });

            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);

            li.appendChild(taskText);
            li.appendChild(actions);
            taskList.appendChild(li);
        });
    };

    const addTask = () => {
        const taskText = prompt("Enter a new task:");
        if (taskText === null || taskText.trim() === '') {
            return;
        }
        const newTask = {
            id: Date.now(),
            text: taskText.trim(),
            done: false,
        };
        tasks.push(newTask);
        saveAndRender();
    };

    const toggleTask = (index) => {
        tasks[index].done = !tasks[index].done;
        saveAndRender();
    };

    const deleteTask = (index) => {
        tasks.splice(index, 1);
        saveAndRender();
    };

    const editTask = (index) => {
        const oldText = tasks[index].text;
        const newText = prompt('Edit your task:', oldText);
        if (newText !== null && newText.trim() !== '') {
            tasks[index].text = newText.trim();
            saveAndRender();
        }
    };

    const clearCompletedTasks = () => {
        tasks = tasks.filter(task => !task.done);
        saveAndRender();
    };

    // --- Local Storage ---
    const saveAndRender = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    const loadTasks = () => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
        }
        renderTasks();
    };

    // --- Theme Switcher ---
    const applyTheme = (theme) => {
        if (theme === 'light') {
            body.classList.add('light-mode');
            themeToggle.checked = true;
        } else {
            body.classList.remove('light-mode');
            themeToggle.checked = false;
        }
    };

    themeToggle.addEventListener('change', () => {
        const theme = themeToggle.checked ? 'light' : 'dark';
        localStorage.setItem('theme', theme);
        applyTheme(theme);
    });

    // --- Event Listeners ---
    fabAddTask.addEventListener('click', addTask);
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    // --- Initial Load ---
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark theme
    applyTheme(savedTheme);
    loadTasks();
});