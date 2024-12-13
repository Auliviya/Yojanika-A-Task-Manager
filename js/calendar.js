document.addEventListener('DOMContentLoaded', function() {
    // Display username in sidebar
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('username-display').textContent = currentUser.username;
    }

    const calendar = {
        init: function() {
            this.initializeElements();
            this.bindEvents();
            this.renderCalendar();
            this.setupTimeSlots();
            this.renderMiniCalendar();
            this.setupDragSelection();
            this.renderDayColumns();
            this.initializeCompletionSync();
            this.initializeTimeInputs();
        },

        initializeElements: function() {
            this.newEventBtn = document.querySelector('.new-event-btn');
            this.modal = document.getElementById('event-modal');
            this.closeBtn = document.querySelector('.close-btn');
            this.eventForm = document.getElementById('event-form');
            this.viewButtons = document.querySelectorAll('.view-btn');
            this.prevBtn = document.getElementById('prev');
            this.nextBtn = document.getElementById('next');
            this.todayBtn = document.getElementById('today');
            this.currentDate = new Date();
            this.eventsContainer = document.getElementById('events-container');
        },

        bindEvents: function() {
            this.newEventBtn.addEventListener('click', () => this.openModal());
            this.closeBtn.addEventListener('click', () => this.closeModal());
            this.eventForm.addEventListener('submit', (e) => this.handleEventSubmit(e));
            this.viewButtons.forEach(btn => {
                btn.addEventListener('click', (e) => this.changeView(e));
            });
            this.prevBtn.addEventListener('click', () => this.navigate('prev'));
            this.nextBtn.addEventListener('click', () => this.navigate('next'));
            this.todayBtn.addEventListener('click', () => this.goToToday());
        },

        setupDragSelection: function() {
            let isSelecting = false;
            let startCell = null;
            let startDate = null;

            this.eventsContainer.addEventListener('mousedown', (e) => {
                if (e.target.classList.contains('time-slot')) {
                    isSelecting = true;
                    startCell = e.target;
                    startDate = this.getCellDateTime(startCell);
                    this.clearSelection();
                    e.preventDefault();
                }
            });

            this.eventsContainer.addEventListener('mousemove', (e) => {
                if (!isSelecting) return;

                const currentCell = this.getClosestTimeSlot(e);
                if (currentCell) {
                    this.updateSelection(startCell, currentCell);
                }
            });

            document.addEventListener('mouseup', (e) => {
                if (isSelecting) {
                    const endCell = this.getClosestTimeSlot(e);
                    if (endCell && startCell) {
                        this.openEventModal(startCell, endCell);
                    }
                    isSelecting = false;
                }
            });
        },

        getClosestTimeSlot: function(e) {
            const element = document.elementFromPoint(e.clientX, e.clientY);
            return element?.classList.contains('time-slot') ? element : null;
        },

        updateSelection: function(startCell, endCell) {
            this.clearSelection();
            
            const startTime = parseInt(startCell.dataset.time);
            const endTime = parseInt(endCell.dataset.time);
            const startColumn = startCell.parentElement;
            const endColumn = endCell.parentElement;
            
            const columns = Array.from(document.querySelectorAll('.day-column'));
            const startColumnIndex = columns.indexOf(startColumn);
            const endColumnIndex = columns.indexOf(endColumn);
            
            const minTime = Math.min(startTime, endTime);
            const maxTime = Math.max(startTime, endTime);
            
            for (let col = Math.min(startColumnIndex, endColumnIndex); 
                 col <= Math.max(startColumnIndex, endColumnIndex); col++) {
                const column = columns[col];
                const slots = column.querySelectorAll('.time-slot');
                
                slots.forEach(slot => {
                    const time = parseInt(slot.dataset.time);
                    if (time >= minTime && time <= maxTime) {
                        slot.classList.add('selecting');
                    }
                });
            }
        },

        clearSelection: function() {
            document.querySelectorAll('.time-slot.selecting').forEach(slot => {
                slot.classList.remove('selecting');
            });
        },

        openEventModal: function(startCell, endCell) {
            const startDateTime = this.getCellDateTime(startCell);
            const endDateTime = this.getCellDateTime(endCell);

            document.getElementById('event-date').valueAsDate = startDateTime;
            document.getElementById('start-time').value = this.formatTimeForInput(startDateTime);
            document.getElementById('end-time').value = this.formatTimeForInput(endDateTime);

            this.modal.style.display = 'block';
        },

        renderCalendar: function() {
            const currentDateEl = document.getElementById('current-date');
            currentDateEl.textContent = this.currentDate.toLocaleDateString('default', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        },

        setupTimeSlots: function() {
            const timeColumn = document.querySelector('.time-column');
            timeColumn.innerHTML = '';
            
            for (let i = 0; i < 24; i++) {
                const timeSlot = document.createElement('div');
                timeSlot.className = 'time-slot';
                
                // Format time to show AM/PM
                const hour = i === 0 ? '12' : 
                            i > 12 ? (i - 12).toString() : 
                            i.toString();
                const period = i >= 12 ? 'PM' : 
                                'AM';
                
                timeSlot.textContent = `${hour} ${period}`;
                timeColumn.appendChild(timeSlot);
            }
        },

        renderMiniCalendar: function() {
            const miniCalendarGrid = document.getElementById('mini-calendar-grid');
            const miniCalendarMonth = document.getElementById('mini-calendar-month');
            miniCalendarGrid.innerHTML = '';

            const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
            const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
            miniCalendarMonth.textContent = this.currentDate.toLocaleDateString('default', {
                month: 'long',
                year: 'numeric'
            });

            for (let i = 1; i <= lastDay.getDate(); i++) {
                const day = document.createElement('div');
                day.textContent = i;
                day.addEventListener('click', () => this.navigateToDate(i));
                miniCalendarGrid.appendChild(day);
            }
        },

        navigateToDate: function(day) {
            this.currentDate.setDate(day);
            this.renderCalendar();
            this.renderDayColumns();
            this.renderMiniCalendar();
        },

        openModal: function() {
            this.modal.style.display = 'block';
        },

        closeModal: function() {
            this.modal.style.display = 'none';
        },

        handleEventSubmit: function(e) {
            e.preventDefault();
            
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                alert('Please log in to create events');
                return;
            }

            const eventTitle = document.getElementById('event-title').value;
            const eventDate = document.getElementById('event-date').value;
            const startTime = document.getElementById('start-time').value;
            const endTime = document.getElementById('end-time').value;
            const eventCategory = document.getElementById('event-category').value;
            
            const eventData = {
                title: eventTitle,
                date: eventDate,
                start: startTime,
                end: endTime,
                category: eventCategory,
                userId: currentUser.id,
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            const calendarTasks = JSON.parse(localStorage.getItem('calendarTasks')) || [];
            calendarTasks.push(eventData);
            localStorage.setItem('calendarTasks', JSON.stringify(calendarTasks));

            this.renderTasks();
            this.closeModal();
        },

        changeView: function(e) {
            this.viewButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            const view = e.target.dataset.view;

            switch (view) {
                case 'day':
                    this.renderDayColumns();
                    break;
                case 'work-week':
                    this.renderWorkWeekColumns();
                    break;
                case 'week':
                    this.renderWeekColumns();
                    break;
                case 'month':
                    this.renderMonthView();
                    break;
            }
        },

        navigate: function(direction) {
            if (direction === 'prev') {
                this.currentDate.setDate(this.currentDate.getDate() - 1);
            } else if (direction === 'next') {
                this.currentDate.setDate(this.currentDate.getDate() + 1);
            }
            this.renderCalendar();
            this.renderDayColumns();
            this.renderMiniCalendar();
        },

        goToToday: function() {
            this.currentDate = new Date();
            this.renderCalendar();
            this.renderDayColumns();
            this.renderMiniCalendar();
        },

        renderTasks: function() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) return;

            const allTasks = JSON.parse(localStorage.getItem('calendarTasks')) || [];
            const userTasks = allTasks.filter(task => task.userId === currentUser.id);
            
            // Clear existing tasks
            document.querySelectorAll('.task').forEach(task => task.remove());
            
            const currentDateStr = this.currentDate.toISOString().split('T')[0];
            const dayColumn = document.querySelector('.day-column');
            
            userTasks.forEach(task => {
                if (task.date === currentDateStr) {
                    const taskElement = document.createElement('div');
                    taskElement.className = 'task';
                    
                    // Create task content wrapper
                    const taskContent = document.createElement('div');
                    taskContent.className = 'task-content';
                    taskContent.textContent = `${task.title} (${task.start} - ${task.end})`;
                    
                    // Create delete button
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'task-delete-btn';
                    deleteBtn.innerHTML = '&times;';
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.deleteTask(task);
                    });
                    
                    // Append elements
                    taskElement.appendChild(taskContent);
                    taskElement.appendChild(deleteBtn);

                    const startTime = new Date(`${task.date}T${task.start}`);
                    const endTime = new Date(`${task.date}T${task.end}`);
                    const duration = (endTime - startTime) / (1000 * 60); // Duration in minutes

                    taskElement.style.top = `${startTime.getHours() * 60 + startTime.getMinutes()}px`;
                    taskElement.style.height = `${duration}px`;
                    
                    dayColumn.appendChild(taskElement);
                }
            });
        },

        deleteTask: function(taskToDelete) {
            if (confirm('Are you sure you want to delete this task?')) {
                const allTasks = JSON.parse(localStorage.getItem('calendarTasks')) || [];
                
                // Filter out the task to delete
                const updatedTasks = allTasks.filter(task => 
                    !(task.date === taskToDelete.date && 
                      task.start === taskToDelete.start && 
                      task.end === taskToDelete.end && 
                      task.title === taskToDelete.title &&
                      task.userId === taskToDelete.userId)
                );
                
                // Save updated tasks back to localStorage
                localStorage.setItem('calendarTasks', JSON.stringify(updatedTasks));
                
                // Re-render tasks
                this.renderTasks();
            }
        },

        renderDayColumns: function() {
            const dayColumns = document.getElementById('day-columns');
            dayColumns.innerHTML = '';

            // For day view, show only one column
            const column = document.createElement('div');
            column.className = 'day-column';

            // Add time slots
            for (let i = 0; i < 24; i++) {
                const timeSlot = document.createElement('div');
                timeSlot.className = 'time-slot';
                timeSlot.dataset.time = i;
                column.appendChild(timeSlot);
            }

            dayColumns.appendChild(column);
            this.renderTasks(); // Re-render tasks for the new date
        },

        renderWorkWeekColumns: function() {
            // Implement logic to render work week view
        },

        renderWeekColumns: function() {
            // Implement logic
        },

        renderMonthView: function() {
            // Implement logic to render month view
        },

        renderEvent: function(event) {
            const eventElement = document.createElement('div');
            eventElement.className = `calendar-event ${event.category} ${event.completed ? 'completed' : ''}`;
            eventElement.setAttribute('data-task-id', event.id);
            
            eventElement.innerHTML = `
                <div class="event-header">
                    <div class="event-checkbox">
                        <input type="checkbox" 
                               id="event-${event.id}" 
                               ${event.completed ? 'checked' : ''}
                               onchange="calendar.toggleEventCompletion('${event.id}', this.checked)">
                        <label for="event-${event.id}"></label>
                    </div>
                    <span class="event-title">${event.title}</span>
                </div>
                <div class="event-time">${event.start} - ${event.end}</div>
                <div class="event-category-indicator ${event.category}"></div>
            `;
            
            return eventElement;
        },

        toggleEventCompletion: function(eventId, completed) {
            const calendarTasks = JSON.parse(localStorage.getItem('calendarTasks')) || [];
            const taskIndex = calendarTasks.findIndex(task => task.id === eventId);
            
            if (taskIndex !== -1) {
                calendarTasks[taskIndex].completed = completed;
                localStorage.setItem('calendarTasks', JSON.stringify(calendarTasks));
                
                // Update event appearance
                const eventElement = document.querySelector(`[data-task-id="${eventId}"]`);
                if (eventElement) {
                    eventElement.classList.toggle('completed', completed);
                }

                // Notify home.html about the change
                window.dispatchEvent(new CustomEvent('taskStatusChanged', {
                    detail: { taskId: eventId, completed }
                }));
            }
        },

        // Listen for changes from home.html
        initializeCompletionSync: function() {
            window.addEventListener('taskStatusChanged', (e) => {
                const { taskId, completed } = e.detail;
                const eventElement = document.querySelector(`[data-task-id="${taskId}"]`);
                if (eventElement) {
                    eventElement.classList.toggle('completed', completed);
                    const checkbox = eventElement.querySelector(`#event-${taskId}`);
                    if (checkbox) {
                        checkbox.checked = completed;
                    }
                }
            });
        },

        initializeTimeInputs: function() {
            // Initialize hours
            const hours = Array.from({length: 12}, (_, i) => i + 1);
            const minutes = Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0'));
            
            const startHour = document.getElementById('start-hour');
            const endHour = document.getElementById('end-hour');
            const startMinute = document.getElementById('start-minute');
            const endMinute = document.getElementById('end-minute');

            // Populate hours
            hours.forEach(hour => {
                const hourStr = hour.toString().padStart(2, '0');
                startHour.innerHTML += `<option value="${hourStr}">${hour}</option>`;
                endHour.innerHTML += `<option value="${hourStr}">${hour}</option>`;
            });

            // Populate minutes
            minutes.forEach(minute => {
                startMinute.innerHTML += `<option value="${minute}">${minute}</option>`;
                endMinute.innerHTML += `<option value="${minute}">${minute}</option>`;
            });

            // Set default values
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            
            // Set start time to current hour
            this.setDefaultTime(startHour, startMinute, document.getElementById('start-period'), currentHour, currentMinute);
            
            // Set end time to next hour
            this.setDefaultTime(endHour, endMinute, document.getElementById('end-period'), currentHour + 1, currentMinute);
        },

        setDefaultTime: function(hourSelect, minuteSelect, periodSelect, hour, minute) {
            const period = hour >= 12 ? 'PM' : 'AM';
            const hour12 = hour % 12 || 12;
            
            hourSelect.value = hour12.toString().padStart(2, '0');
            minuteSelect.value = minute.toString().padStart(2, '0');
            periodSelect.value = period;
        },

        getTimeString: function(hour, minute, period) {
            return `${hour}:${minute} ${period}`;
        },

        handleEventSubmit: function(e) {
            e.preventDefault();
            
            const startHour = document.getElementById('start-hour').value;
            const startMinute = document.getElementById('start-minute').value;
            const startPeriod = document.getElementById('start-period').value;
            
            const endHour = document.getElementById('end-hour').value;
            const endMinute = document.getElementById('end-minute').value;
            const endPeriod = document.getElementById('end-period').value;

            const event = {
                title: document.getElementById('event-title').value,
                date: document.getElementById('event-date').value,
                start: this.getTimeString(startHour, startMinute, startPeriod),
                end: this.getTimeString(endHour, endMinute, endPeriod),
                category: document.getElementById('event-category').value,
                description: document.getElementById('event-form').querySelector('textarea').value,
                id: Date.now().toString(),
                completed: false
            };

            // Save event and update calendar
            this.saveEvent(event);
        },

        initializeTimeSelectors: function() {
            // Set default values based on current time
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            
            // Set start time
            this.setDefaultTime('start', currentHour, currentMinute);
            
            // Set end time (1 hour after start time)
            this.setDefaultTime('end', currentHour + 1, currentMinute);

            // Add event listeners for time validation
            document.getElementById('start-hour').addEventListener('change', () => this.validateTimeRange());
            document.getElementById('start-minute').addEventListener('change', () => this.validateTimeRange());
            document.getElementById('start-period').addEventListener('change', () => this.validateTimeRange());
            document.getElementById('end-hour').addEventListener('change', () => this.validateTimeRange());
            document.getElementById('end-minute').addEventListener('change', () => this.validateTimeRange());
            document.getElementById('end-period').addEventListener('change', () => this.validateTimeRange());
        },

        setDefaultTime: function(prefix, hour, minute) {
            const period = hour >= 12 ? 'PM' : 'AM';
            const hour12 = hour % 12 || 12;
            
            const hourSelect = document.getElementById(`${prefix}-hour`);
            const minuteSelect = document.getElementById(`${prefix}-minute`);
            const periodSelect = document.getElementById(`${prefix}-period`);

            hourSelect.value = hour12.toString().padStart(2, '0');
            minuteSelect.value = (Math.floor(minute / 5) * 5).toString().padStart(2, '0');
            periodSelect.value = period;
        },

        validateTimeRange: function() {
            const startHour = parseInt(document.getElementById('start-hour').value);
            const startMinute = parseInt(document.getElementById('start-minute').value);
            const startPeriod = document.getElementById('start-period').value;
            
            const endHour = parseInt(document.getElementById('end-hour').value);
            const endMinute = parseInt(document.getElementById('end-minute').value);
            const endPeriod = document.getElementById('end-period').value;

            // Convert to 24-hour format for comparison
            const start24Hour = this.convertTo24Hour(startHour, startPeriod);
            const end24Hour = this.convertTo24Hour(endHour, endPeriod);

            if (start24Hour > end24Hour || 
                (start24Hour === end24Hour && startMinute >= endMinute)) {
                document.querySelector('.btn-save').disabled = true;
                alert('End time must be after start time');
            } else {
                document.querySelector('.btn-save').disabled = false;
            }
        },

        convertTo24Hour: function(hour, period) {
            if (period === 'PM' && hour !== 12) {
                return hour + 12;
            }
            if (period === 'AM' && hour === 12) {
                return 0;
            }
            return hour;
        }
    };

    calendar.init();

    window.addEventListener('taskStatusChanged', function(e) {
        const { taskId, completed } = e.detail;
        
        // Update task appearance in calendar
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        if (taskElement) {
            if (completed) {
                taskElement.classList.add('completed');
            } else {
                taskElement.classList.remove('completed');
            }
        }
    });

    // Add CSS for completed tasks in calendar
    const style = document.createElement('style');
    style.textContent = `
        .calendar-event.completed {
            opacity: 0.7;
            background: #e8f5e9 !important;
            border-left: 3px solid #4CAF50 !important;
        }
    `;
    document.head.appendChild(style);

    // Initialize time selectors when modal opens
    document.querySelector('.new-event-btn').addEventListener('click', () => {
        calendar.initializeTimeSelectors();
    });
});