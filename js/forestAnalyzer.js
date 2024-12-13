class ForestAnalyzer {
    constructor() {
        this.canvas = document.getElementById('forestCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.trees = [];
        this.productivityScore = 0;
        this.maxTrees = 50;
        
        this.initializeCanvas();
        this.loadTasks();
    }

    initializeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = 300;
        this.drawBackground();
    }

    loadTasks() {
        const calendarTasks = JSON.parse(localStorage.getItem('calendarTasks')) || [];
        const homeTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const allTasks = [...calendarTasks, ...homeTasks];
        
        // Calculate today's productivity
        const today = new Date().toDateString();
        const todaysTasks = allTasks.filter(task => 
            new Date(task.date).toDateString() === today
        );

        const completedTasks = todaysTasks.filter(task => task.completed);
        this.productivityScore = todaysTasks.length ? 
            (completedTasks.length / todaysTasks.length) * 100 : 0;

        this.updateForest();
    }

    updateForest() {
        const treeCount = Math.floor((this.productivityScore / 100) * this.maxTrees);
        this.trees = this.generateTrees(treeCount);
        this.drawForest();
        this.updateStats();
    }

    generateTrees(count) {
        const trees = [];
        for (let i = 0; i < count; i++) {
            trees.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * (this.canvas.height - 50) + 50,
                size: Math.random() * 20 + 20,
                type: Math.random() > 0.5 ? 'pine' : 'oak'
            });
        }
        return trees;
    }

    drawTree(x, y, size, type) {
        const ctx = this.ctx;
        
        // Draw trunk
        ctx.fillStyle = '#5D4037';
        ctx.fillRect(x - size/6, y - size/2, size/3, size);

        // Draw foliage
        ctx.fillStyle = this.productivityScore > 70 ? '#2E7D32' : 
                       this.productivityScore > 40 ? '#388E3C' : '#A5D6A7';
        
        if (type === 'pine') {
            // Draw triangle for pine trees
            ctx.beginPath();
            ctx.moveTo(x, y - size);
            ctx.lineTo(x + size/2, y - size/3);
            ctx.lineTo(x - size/2, y - size/3);
            ctx.closePath();
            ctx.fill();
        } else {
            // Draw circle for oak trees
            ctx.beginPath();
            ctx.arc(x, y - size/2, size/2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawBackground() {
        const ctx = this.ctx;
        
        // Draw sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#E8F5E9');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw ground
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, this.canvas.height - 20, this.canvas.width, 20);
    }

    drawForest() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawBackground();
        
        // Sort trees by y position for proper layering
        this.trees.sort((a, b) => a.y - b.y);
        this.trees.forEach(tree => {
            this.drawTree(tree.x, tree.y, tree.size, tree.type);
        });
    }

    updateStats() {
        document.getElementById('tree-count').textContent = 
            `${this.trees.length} trees`;
        document.getElementById('productivity-score').textContent = 
            `${Math.round(this.productivityScore)}% productive`;
    }
} 