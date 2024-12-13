document.addEventListener('DOMContentLoaded', function() {
    const Insights = {
        init: function() {
            this.initializeCharts();
            this.bindEvents();
            this.loadJournalEntries();
        },
  
        initializeCharts: function() {
            // Task Completion Chart
            const completionCtx = document.getElementById('completionChart').getContext('2d');
            this.completionChart = new Chart(completionCtx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Tasks Completed',
                        data: [8, 12, 15, 10, 14, 9, 11],
                        borderColor: '#4A90E2',
                        backgroundColor: 'rgba(74, 144, 226, 0.1)',
                        tension: 0.4,
                        fill: true
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
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#A0AEC0'
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#A0AEC0'
                            }
                        }
                    }
                }
            });
  
            // Productivity Chart
            const productivityCtx = document.getElementById('productivityChart').getContext('2d');
            this.productivityChart = new Chart(productivityCtx, {
                type: 'bar',
                data: {
                    labels: ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'],
                    datasets: [{
                        label: 'Productivity Score',
                        data: [65, 78, 90, 85, 60, 75, 88, 92, 70],
                        backgroundColor: '#48BB78'
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
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#A0AEC0'
                            }
                        },
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            ticks: {
                                color: '#A0AEC0'
                            }
                        }
                    }
                }
            });
        },
  
        bindEvents: function() {
            // Date filter buttons
            document.querySelectorAll('.date-btn').forEach(btn => {
                btn.addEventListener('click', (e) => this.handleDateFilter(e));
            });
  
            // Chart filter buttons
            document.querySelectorAll('.chart-filter').forEach(btn => {
                btn.addEventListener('click', (e) => this.handleChartFilter(e));
            });
  
            // Journal events
            document.getElementById('newEntryBtn').addEventListener('click', () => this.newJournalEntry());
            document.getElementById('saveJournalBtn').addEventListener('click', () => this.saveJournalEntry());
            document.getElementById('cancelJournalBtn').addEventListener('click', () => this.cancelJournalEntry());
        },
  
        handleDateFilter: function(e) {
            document.querySelectorAll('.date-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            this.updateCharts(e.target.dataset.period);
        },
  
        handleChartFilter: function(e) {
            const filterBtns = e.target.parentElement.querySelectorAll('.chart-filter');
            filterBtns.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            this.updateChartData(e.target.dataset.chart, e.target.textContent);
        },
  
        updateCharts: function(period) {
            // Update charts based on selected period
            // This would typically fetch new data from an API
            console.log(`Updating charts for ${period}`);
        },
  
        updateChartData: function(chartType, filter) {
            // Update specific chart based on filter
            console.log(`Updating ${chartType} chart with filter: ${filter}`);
        },
  
        loadJournalEntries: function() {
            const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
            const entriesContainer = document.getElementById('journalEntries');
            
            entriesContainer.innerHTML = entries.map(entry => `
                <div class="journal-entry" data-id="${entry.id}">
                    <h4>${entry.title}</h4>
                    <p>${entry.date}</p>
                </div>
            `).join('');
        },
  
        newJournalEntry: function() {
            document.getElementById('journalTitle').value = '';
            document.getElementById('journalText').value = '';
            document.getElementById('journalTitle').focus();
        },
  
        saveJournalEntry: function() {
            const title = document.getElementById('journalTitle').value;
            const text = document.getElementById('journalText').value;
  
            if (!title || !text) {
                alert('Please fill in both title and content');
                return;
            }
  
            const entry = {
                id: Date.now(),
                title,
                text,
                date: new Date().toLocaleDateString()
            };
  
            const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
            entries.unshift(entry);
            localStorage.setItem('journalEntries', JSON.stringify(entries));
  
            this.loadJournalEntries();
            this.newJournalEntry();
        },
  
        cancelJournalEntry: function() {
            this.newJournalEntry();
        }
    };
  
    Insights.init();
  
    const forestAnalyzer = new ForestAnalyzer();
    
    // Update forest when tasks change
    window.addEventListener('storage', (e) => {
        if (e.key === 'calendarTasks' || e.key === 'tasks') {
            forestAnalyzer.loadTasks();
        }
    });
});

// Sample data for demonstration
const sampleData = {
    tasks: [
        { id: 1, title: "Morning Meeting", completed: true, category: "work", time: "09:00" },
        { id: 2, title: "Project Review", completed: true, category: "work", time: "11:00" },
        { id: 3, title: "Lunch Break", completed: true, category: "personal", time: "13:00" },
        { id: 4, title: "Code Review", completed: true, category: "work", time: "14:00" },
        { id: 5, title: "Exercise", completed: true, category: "health", time: "17:00" },
        { id: 6, title: "Team Meeting", completed: true, category: "work", time: "15:00" },
        { id: 7, title: "Reading", completed: true, category: "personal", time: "19:00" },
        { id: 8, title: "Planning", completed: true, category: "work", time: "16:00" }
    ],
    completionRate: 100,
    productivityScore: 100
};

// Enhanced Forest Analyzer with flourishing forest
class ForestAnalyzer {
    constructor() {
        this.canvas = document.getElementById('forestCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.trees = [];
        this.animals = [];
        this.flowers = [];
        this.maxTrees = 50;
        
        this.initializeCanvas();
        this.loadSampleData(); // Using sample data for demonstration
    }

    loadSampleData() {
        this.productivityScore = sampleData.completionRate;
        this.updateForest();
    }

    generateTrees(count) {
        const trees = [];
        for (let i = 0; i < count; i++) {
            trees.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * (this.canvas.height - 50) + 50,
                size: Math.random() * 30 + 25, // Larger trees for flourishing forest
                type: Math.random() > 0.3 ? 'oak' : 'pine',
                swayOffset: Math.random() * Math.PI * 2
            });
        }
        return trees;
    }

    drawFlourishingForest() {
        // Clear canvas and draw sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB'); // Sky blue
        gradient.addColorStop(1, '#98FB98'); // Light green
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw sun
        this.ctx.beginPath();
        this.ctx.arc(50, 50, 30, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fill();

        // Draw clouds
        this.drawCloud(100, 80);
        this.drawCloud(300, 60);
        this.drawCloud(500, 90);

        // Draw grass
        this.ctx.fillStyle = '#2E7D32';
        this.ctx.fillRect(0, this.canvas.height - 30, this.canvas.width, 30);

        // Draw flowers
        for (let i = 0; i < 50; i++) {
            this.drawFlower(
                Math.random() * this.canvas.width,
                this.canvas.height - 25 + Math.random() * 10
            );
        }

        // Draw trees with slight animation
        this.trees.forEach((tree, index) => {
            const sway = Math.sin(Date.now() / 1000 + tree.swayOffset) * 2;
            this.drawTree(
                tree.x + sway,
                tree.y,
                tree.size,
                tree.type,
                '#2E7D32' // Healthy green color
            );
        });

        // Draw butterflies
        for (let i = 0; i < 5; i++) {
            this.drawButterfly(
                Math.random() * this.canvas.width,
                Math.random() * (this.canvas.height - 100) + 50
            );
        }
    }

    drawCloud(x, y) {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, Math.PI * 2);
        this.ctx.arc(x + 15, y - 10, 15, 0, Math.PI * 2);
        this.ctx.arc(x + 25, y + 5, 18, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawFlower(x, y) {
        const colors = ['#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB'];
        this.ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        
        // Draw petals
        for (let i = 0; i < 5; i++) {
            this.ctx.beginPath();
            this.ctx.ellipse(
                x + Math.cos(i * Math.PI * 2/5) * 5,
                y + Math.sin(i * Math.PI * 2/5) * 5,
                3, 3, 0, 0, Math.PI * 2
            );
            this.ctx.fill();
        }

        // Draw center
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 2, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawButterfly(x, y) {
        const colors = ['#FF69B4', '#87CEEB', '#FFD700', '#98FB98'];
        this.ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        
        // Draw wings
        this.ctx.beginPath();
        this.ctx.ellipse(x - 5, y, 5, 8, Math.PI/4, 0, Math.PI * 2);
        this.ctx.ellipse(x + 5, y, 5, 8, -Math.PI/4, 0, Math.PI * 2);
        this.ctx.fill();
    }

    animate() {
        this.drawFlourishingForest();
        requestAnimationFrame(() => this.animate());
    }

    updateForest() {
        this.trees = this.generateTrees(this.maxTrees);
        this.animate();
        this.updateStats();
    }

    updateStats() {
        document.getElementById('tree-count').textContent = 
            `${this.trees.length} trees (Flourishing!)`;
        document.getElementById('productivity-score').textContent = 
            `100% productive - Perfect Day!`;
    }
}

// Initialize the forest
document.addEventListener('DOMContentLoaded', () => {
    const forest = new ForestAnalyzer();
});

document.addEventListener('DOMContentLoaded', () => {
    // Set current date
    const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('currentDate').textContent = currentDate;

    // Format toolbar functionality
    const toolButtons = document.querySelectorAll('.tool-btn');
    toolButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
        });
    });

    // Save functionality
    document.getElementById('saveJournalBtn').addEventListener('click', () => {
        const journalEntry = {
            id: Date.now(),
            title: document.getElementById('journalTitle').value,
            content: document.getElementById('journalText').value,
            mood: document.getElementById('moodSelect').value,
            date: new Date().toISOString(),
        };

        // Save to localStorage
        const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
        entries.unshift(journalEntry);
        localStorage.setItem('journalEntries', JSON.stringify(entries));

        // Add to sidebar
        addEntryToSidebar(journalEntry);

        // Show success message
        showNotification('Journal entry saved successfully!');
    });
});

function addEntryToSidebar(entry) {
    const entryElement = document.createElement('div');
    entryElement.className = 'journal-entry';
    entryElement.innerHTML = `
        <h3>${entry.title}</h3>
        <div class="entry-meta">
            <span>${new Date(entry.date).toLocaleDateString()}</span>
            <span class="mood-indicator">${getMoodEmoji(entry.mood)}</span>
        </div>
    `;
    document.getElementById('journalEntries').prepend(entryElement);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function getMoodEmoji(mood) {
    const moods = {
        productive: '😊',
        neutral: '😐',
        stressed: '😓',
        motivated: '🚀'
    };
    return moods[mood] || '😊';
}