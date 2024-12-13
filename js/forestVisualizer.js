class ForestVisualizer {
    constructor() {
        this.canvas = document.getElementById('forestCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        // Virtual data for demonstration
        this.productivityData = {
            completionRate: 95,
            tasksCompleted: 28,
            totalTasks: 30,
            timeOfDay: new Date().getHours()
        };

        this.elements = {
            trees: [],
            bushes: [],
            flowers: [],
            birds: [],
            butterflies: []
        };

        this.initializeForest();
        this.animate();

        // Handle window resize
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = 400;
    }

    initializeForest() {
        // Generate dense forest elements based on productivity
        const density = this.productivityData.completionRate / 100;
        
        // Generate trees
        for (let i = 0; i < 40 * density; i++) {
            this.elements.trees.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * (this.canvas.height - 100) + 50,
                size: Math.random() * 30 + 40,
                type: Math.random() > 0.5 ? 'pine' : 'oak',
                swayOffset: Math.random() * Math.PI * 2,
                swaySpeed: Math.random() * 0.002 + 0.001
            });
        }

        // Generate bushes
        for (let i = 0; i < 60 * density; i++) {
            this.elements.bushes.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height - Math.random() * 60 - 20,
                size: Math.random() * 15 + 10
            });
        }

        // Generate flowers
        for (let i = 0; i < 100 * density; i++) {
            this.elements.flowers.push({
                x: Math.random() * this.canvas.width,
                y: this.canvas.height - Math.random() * 40 - 10,
                color: ['#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB'][Math.floor(Math.random() * 4)],
                size: Math.random() * 5 + 3
            });
        }

        // Generate butterflies
        for (let i = 0; i < 8 * density; i++) {
            this.elements.butterflies.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * (this.canvas.height - 100) + 50,
                color: ['#FFD700', '#FF69B4', '#87CEEB'][Math.floor(Math.random() * 3)],
                wingSpan: Math.random() * 5 + 8,
                speed: Math.random() * 2 + 1,
                offset: Math.random() * Math.PI * 2
            });
        }

        // Generate birds
        for (let i = 0; i < 5 * density; i++) {
            this.elements.birds.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * (this.canvas.height - 200) + 50,
                speed: Math.random() * 3 + 2,
                size: Math.random() * 5 + 8
            });
        }
    }

    drawSky() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        const hour = this.productivityData.timeOfDay;
        
        if (hour >= 6 && hour < 18) { // Daytime
            gradient.addColorStop(0, '#87CEEB');
            gradient.addColorStop(1, '#B0E2FF');
        } else { // Night time
            gradient.addColorStop(0, '#1a1a2e');
            gradient.addColorStop(1, '#34344A');
        }
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawTree(tree) {
        const sway = Math.sin(Date.now() * tree.swaySpeed + tree.swayOffset) * 5;
        
        // Draw trunk
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(
            tree.x - tree.size/8 + sway, 
            tree.y, 
            tree.size/4, 
            tree.size
        );

        // Draw foliage
        this.ctx.fillStyle = '#228B22';
        if (tree.type === 'pine') {
            for (let i = 0; i < 3; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(tree.x + sway, tree.y - tree.size * 0.3 * i);
                this.ctx.lineTo(tree.x + tree.size/2 + sway, tree.y - tree.size * 0.3 * (i + 1));
                this.ctx.lineTo(tree.x - tree.size/2 + sway, tree.y - tree.size * 0.3 * (i + 1));
                this.ctx.fill();
            }
        } else {
            this.ctx.beginPath();
            this.ctx.arc(
                tree.x + sway, 
                tree.y - tree.size * 0.5, 
                tree.size * 0.6, 
                0, 
                Math.PI * 2
            );
            this.ctx.fill();
        }
    }

    drawButterfly(butterfly) {
        butterfly.x += Math.sin(Date.now() * 0.001 + butterfly.offset) * 2;
        butterfly.y += Math.cos(Date.now() * 0.001 + butterfly.offset) * 1.5;

        this.ctx.fillStyle = butterfly.color;
        const wingAngle = Math.sin(Date.now() * 0.01) * Math.PI / 4;

        // Draw wings
        this.ctx.save();
        this.ctx.translate(butterfly.x, butterfly.y);
        this.ctx.rotate(wingAngle);
        this.ctx.beginPath();
        this.ctx.ellipse(-butterfly.wingSpan/2, 0, butterfly.wingSpan, butterfly.wingSpan/2, 0, 0, Math.PI * 2);
        this.ctx.ellipse(butterfly.wingSpan/2, 0, butterfly.wingSpan, butterfly.wingSpan/2, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    drawBird(bird) {
        bird.x += bird.speed;
        if (bird.x > this.canvas.width + 20) bird.x = -20;

        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.moveTo(bird.x, bird.y);
        this.ctx.quadraticCurveTo(
            bird.x + 10, 
            bird.y - 10 + Math.sin(Date.now() * 0.01) * 5,
            bird.x + 20, 
            bird.y
        );
        this.ctx.quadraticCurveTo(
            bird.x + 10, 
            bird.y + 10 + Math.sin(Date.now() * 0.01) * 5,
            bird.x, 
            bird.y
        );
        this.ctx.fill();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.drawSky();
        
        // Draw all elements
        this.elements.trees.forEach(tree => this.drawTree(tree));
        this.elements.bushes.forEach(bush => {
            this.ctx.fillStyle = '#2E8B57';
            this.ctx.beginPath();
            this.ctx.arc(bush.x, bush.y, bush.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.elements.flowers.forEach(flower => {
            this.ctx.fillStyle = flower.color;
            this.ctx.beginPath();
            this.ctx.arc(flower.x, flower.y, flower.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.elements.butterflies.forEach(butterfly => this.drawButterfly(butterfly));
        this.elements.birds.forEach(bird => this.drawBird(bird));

        // Update stats
        document.getElementById('tree-count').textContent = 
            `${this.elements.trees.length} trees (Thriving!)`;
        document.getElementById('productivity-score').textContent = 
            `${this.productivityData.completionRate}% productive - Amazing!`;

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the forest visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ForestVisualizer();
}); 