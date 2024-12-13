class PomodoroTimer {
    constructor() {
        this.timeLeft = 25 * 60; // 25 minutes in seconds
        this.initialTime = 25 * 60;
        this.isRunning = false;
        this.sessions = 0;
        this.mode = 'focus';
        this.timer = null;

        this.initializeElements();
        this.initializeEventListeners();
        this.updateDisplay();
        this.initializeFocusChart();
    }

    initializeElements() {
        this.minutesDisplay = document.getElementById('minutes');
        this.secondsDisplay = document.getElementById('seconds');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.sessionCount = document.getElementById('sessionCount');
        this.focusTime = document.getElementById('focusTime');
        this.timerProgress = document.querySelector('.timer-foreground');
    }

    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());

        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeMode(e.target.dataset.mode));
        });
    }

    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        this.isRunning = true;
        this.startBtn.innerHTML = '<i class="fas fa-pause"></i>';
        this.startBtn.classList.add('active');

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();

            if (this.timeLeft === 0) {
                this.completeSession();
            }
        }, 1000);
    }

    pauseTimer() {
        this.isRunning = false;
        this.startBtn.innerHTML = '<i class="fas fa-play"></i>';
        this.startBtn.classList.remove('active');
        clearInterval(this.timer);
    }

    resetTimer() {
        this.pauseTimer();
        this.timeLeft = this.initialTime;
        this.updateDisplay();
    }

    completeSession() {
        this.pauseTimer();
        this.sessions++;
        this.sessionCount.textContent = this.sessions;
        
        // Update focus time
        const hours = Math.floor(this.sessions * 25 / 60);
        const minutes = (this.sessions * 25) % 60;
        this.focusTime.textContent = `${hours}h ${minutes}m`;

        // Play notification sound
        this.playNotification();

        if (this.mode === 'focus') {
            this.changeMode(this.sessions % 4 === 0 ? 'long-break' : 'short-break');
        } else {
            this.changeMode('focus');
        }
    }

    changeMode(mode) {
        this.mode = mode;
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        switch (mode) {
            case 'focus':
                this.initialTime = 25 * 60;
                break;
            case 'short-break':
                this.initialTime = 5 * 60;
                break;
            case 'long-break':
                this.initialTime = 15 * 60;
                break;
        }

        this.timeLeft = this.initialTime;
        this.updateDisplay();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;

        this.minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        this.secondsDisplay.textContent = seconds.toString().padStart(2, '0');

        // Update progress circle
        const progress = (this.initialTime - this.timeLeft) / this.initialTime;
        const circumference = 2 * Math.PI * 45;
        this.timerProgress.style.strokeDashoffset = circumference * (1 - progress);
    }

    initializeFocusChart() {
        const ctx = document.getElementById('focusChart').getContext('2d');
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'],
                datasets: [{
                    label: 'Focus Score',
                    data: [65, 78, 90, 85, 75, 88, 92, 86, 80],
                    borderColor: '#8A2BE2',
                    backgroundColor: 'rgba(138, 43, 226, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#B0B0B0'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#B0B0B0'
                        }
                    }
                }
            }
        });
    }

    playNotification() {
        // Add notification sound
        const audio = new Audio('/assets/notification.mp3');
        audio.play();
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});

// Add this to your existing JavaScript for rotating quotes
const quotes = [
    {
        text: "Time is not refundable, use it with intention.",
        author: "Productivity Wisdom"
    },
    {
        text: "Focus on being productive instead of busy.",
        author: "Tim Ferriss"
    },
    {
        text: "The way to get started is to quit talking and begin doing.",
        author: "Walt Disney"
    },
    {
        text: "It's not about time, it's about energy.",
        author: "Naval Ravikant"
    }
];

function updateQuote() {
    const quoteText = document.querySelector('.quote-text');
    const quoteAuthor = document.querySelector('.quote-author');
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    quoteText.textContent = `"${randomQuote.text}"`;
    quoteAuthor.textContent = `- ${randomQuote.author}`;
}

// Update quote when page loads
document.addEventListener('DOMContentLoaded', updateQuote);

// Update quote every 5 minutes
setInterval(updateQuote, 300000);
