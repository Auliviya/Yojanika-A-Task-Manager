document.addEventListener('DOMContentLoaded', function() {
    const app = {
        init: function() {
            this.initializeElements();
            this.bindEvents();
            this.loadTasks();
        },

        initializeElements: function() {
            this.modal = document.getElementById('task-modal');
            this.addTaskBtn = document.querySelector('.add-task-btn');
            this.closeModalBtn = document.querySelector('.close-modal');
            this.taskForm = document.getElementById('task-form');
            this.tasksContainer = document.getElementById('tasks-container');
            this.filterBtns = document.querySelectorAll('.filter-btn');
        },

        bindEvents: function() {
            this.addTaskBtn.addEventListener('click', () => this.openModal());
            this.closeModalBtn.addEventListener('click', () => this.closeModal());
            this.taskForm.addEventListener('submit', (e) => this.handleTaskSubmit(e));
            
            // Filter buttons
            this.filterBtns.forEach(btn => {
                btn.addEventListener('click', (e) => this.handleFilterClick(e));
            });

            // Close modal when clicking outside
            window.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        },

        openModal: function() {
            this.modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        },

        closeModal: function() {
            this.modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            this.taskForm.reset();
        },

        handleTaskSubmit: function(e) {
            e.preventDefault();
            const formData = new FormData(this.taskForm);
            const taskData = {
                id: Date.now(),
                title: formData.get('title'),
                description: formData.get('description'),
                category: formData.get('category'),
                dueDate: formData.get('dueDate'),
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            this.saveTask(taskData);
            this.renderTask(taskData);
            this.closeModal();
            this.updateTaskCounters();
        },

        saveTask: function(task) {
            const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            tasks.push(task);
            localStorage.setItem('tasks', JSON.stringify(tasks));
        },

        loadTasks: function() {
            const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            tasks.forEach(task => this.renderTask(task));
            this.updateTaskCounters();
        },

        renderTask: function(task) {
            const taskElement = document.createElement('div');
            taskElement.className = 'task-item';
            taskElement.innerHTML = `
                <div class="task-content">
                    <h4>${task.title}</h4>
                    <p>${task.description}</p>
                    <div class="task-meta">
                        <span class="task-category ${task.category}">${task.category}</span>
                        <span class="task-date">${this.formatDate(task.dueDate)}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-action" data-action="complete" data-id="${task.id}">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="task-action" data-action="edit" data-id="${task.id}">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="task-action" data-action="delete" data-id="${task.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            // Add event listeners for task actions
            const actions = taskElement.querySelectorAll('.task-action');
            actions.forEach(action => {
                action.addEventListener('click', (e) => {
                    const actionType = e.currentTarget.dataset.action;
                    const taskId = e.currentTarget.dataset.id;
                    this.handleTaskAction(actionType, taskId);
                });
            });

            this.tasksContainer.appendChild(taskElement);
        },

        handleTaskAction: function(action, taskId) {
            switch(action) {
                case 'complete':
                    this.completeTask(taskId);
                    break;
                case 'edit':
                    this.editTask(taskId);
                    break;
                case 'delete':
                    this.deleteTask(taskId);
                    break;
            }
        },

        completeTask: function(taskId) {
            const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            const taskIndex = tasks.findIndex(t => t.id === parseInt(taskId));
            if (taskIndex !== -1) {
                tasks[taskIndex].status = 'completed';
                localStorage.setItem('tasks', JSON.stringify(tasks));
                this.updateTaskCounters();
                // Update UI
                const taskElement = document.querySelector(`[data-id="${taskId}"]`).closest('.task-item');
                taskElement.classList.add('completed');
            }
        },

        deleteTask: function(taskId) {
            if (confirm('Are you sure you want to delete this task?')) {
                const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
                const updatedTasks = tasks.filter(t => t.id !== parseInt(taskId));
                localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                const taskElement = document.querySelector(`[data-id="${taskId}"]`).closest('.task-item');
                taskElement.remove();
                this.updateTaskCounters();
            }
        },

        updateTaskCounters: function() {
            const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
            const total = tasks.length;
            const completed = tasks.filter(t => t.status === 'completed').length;
            const pending = total - completed;

            // Update counters in the UI
            document.querySelector('.total .card-info h2').textContent = total;
            document.querySelector('.completed .card-info h2').textContent = completed;
            document.querySelector('.pending .card-info h2').textContent = pending;
        },

        handleFilterClick: function(e) {
            this.filterBtns.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            const filter = e.target.textContent.toLowerCase();
            this.filterTasks(filter);
        },

        filterTasks: function(filter) {
            const tasks = document.querySelectorAll('.task-item');
            tasks.forEach(task => {
                const dueDate = new Date(task.querySelector('.task-date').textContent);
                const today = new Date();
                const showTask = filter === 'all' ||
                    (filter === 'today' && this.isToday(dueDate)) ||
                    (filter === 'this week' && this.isThisWeek(dueDate));
                
                task.style.display = showTask ? 'flex' : 'none';
            });
        },

        formatDate: function(date) {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },

        isToday: function(date) {
            const today = new Date();
            return date.toDateString() === today.toDateString();
        },

        isThisWeek: function(date) {
            const today = new Date();
            const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
            const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
            return date >= weekStart && date <= weekEnd;
        }
    };

    app.init();
});

const dashboard = {
    init: function() {
        this.updateTaskOverview();
        this.updateTaskCategories();
        this.renderRecentTasks();
    },

    updateTaskOverview: function() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;

        const calendarTasks = JSON.parse(localStorage.getItem('calendarTasks')) || [];
        const userTasks = calendarTasks.filter(task => task.userId === currentUser.id);

        // Calculate statistics
        const totalTasks = userTasks.length;
        const completedTasks = userTasks.filter(task => task.status === 'completed').length;
        const pendingTasks = userTasks.filter(task => task.status === 'pending').length;

        // Update overview cards
        document.querySelector('.total h2').textContent = totalTasks;
        document.querySelector('.completed h2').textContent = completedTasks;
        document.querySelector('.pending h2').textContent = pendingTasks;

        // Calculate and update trends (optional)
        // You can implement trend calculation based on task creation dates
    },

    updateTaskCategories: function() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;

        const calendarTasks = JSON.parse(localStorage.getItem('calendarTasks')) || [];
        const userTasks = calendarTasks.filter(task => task.userId === currentUser.id);

        // Count tasks by category
        const categoryCounts = {
            work: userTasks.filter(task => task.category === 'work').length,
            personal: userTasks.filter(task => task.category === 'personal').length,
            market: userTasks.filter(task => task.category === 'market').length,
            health: userTasks.filter(task => task.category === 'health').length
        };

        // Update category cards
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            const category = card.classList[1]; // work, personal, etc.
            const taskCount = categoryCounts[category] || 0;
            
            // Update task count
            card.querySelector('p').textContent = `${taskCount} tasks`;
            
            // Update progress bar (assuming max of 20 tasks per category)
            const progress = (taskCount / 20) * 100;
            card.querySelector('.progress').style.width = `${progress}%`;
        });
    },

    renderRecentTasks: function() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;

        // Parse the calendarTasks string to JSON if it's stored as a string
        const calendarTasksStr = localStorage.getItem('calendarTasks');
        const calendarTasks = calendarTasksStr ? JSON.parse(calendarTasksStr) : [];
        
        // Sort tasks by creation date
        const sortedTasks = calendarTasks.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        const tasksContainer = document.getElementById('tasks-container');
        tasksContainer.innerHTML = '';

        sortedTasks.forEach(task => {
            // Format the times from the calendar format
            const startTime = new Date(task.startTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            
            const endTime = new Date(task.endTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            
            const taskElement = document.createElement('div');
            taskElement.className = `task-item ${task.category}`;
            taskElement.innerHTML = `
                <div class="task-info">
                    <h4>${task.title}</h4>
                    <p>Date: ${task.date}</p>
                    <p>Time: ${startTime} - ${endTime}</p>
                </div>
                <div class="task-actions">
                    <button class="status-btn ${task.status}"
                            onclick="dashboard.toggleTaskStatus('${task.id}')">
                        ${task.status === 'completed' ? 'Completed' : 'Pending'}
                    </button>
                </div>
            `;
            tasksContainer.appendChild(taskElement);
        });

        // If no tasks, show a message
        if (sortedTasks.length === 0) {
            tasksContainer.innerHTML = `
                <div class="no-tasks-message">
                    <i class="fas fa-tasks"></i>
                    <p>No tasks scheduled for today</p>
                </div>
            `;
        }
    },

    toggleTaskStatus: function(taskId) {
        const calendarTasks = JSON.parse(localStorage.getItem('calendarTasks')) || [];
        const taskIndex = calendarTasks.findIndex(task => task.id === taskId);

        if (taskIndex !== -1) {
            calendarTasks[taskIndex].status = 
                calendarTasks[taskIndex].status === 'completed' ? 'pending' : 'completed';
            localStorage.setItem('calendarTasks', JSON.stringify(calendarTasks));
            
            // Update the dashboard
            this.updateTaskOverview();
            this.updateTaskCategories();
            this.renderRecentTasks();
        }
    }
};

// Initialize dashboard when the page loads
document.addEventListener('DOMContentLoaded', function() {
    dashboard.init();
});