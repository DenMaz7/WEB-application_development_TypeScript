"use strict";
class RacingGame {
    constructor() {
        this.enemyCars = [];
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.level = 1;
        this.speed = 0;
        this.playerPosition = 170; // центр дороги
        this.gameLoop = null;
        this.enemySpawnTimer = 0;
        this.roadWidth = 400;
        this.carWidth = 60;
        this.initializeElements();
        this.setupEventListeners();
        this.initializeGame();
    }
    initializeElements() {
        this.gameArea = document.querySelector('.game-area');
        this.playerCar = document.getElementById('playerCar');
        this.road = document.querySelector('.road');
        this.scoreElement = document.getElementById('score');
        this.speedElement = document.getElementById('speed');
        this.levelElement = document.getElementById('level');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.gameOverScreen = document.getElementById('gameOver');
        this.finalScoreElement = document.getElementById('finalScore');
    }
    setupEventListeners() {
        // Кнопки управління
        this.startBtn.addEventListener('click', () => this.startGame());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.restartBtn.addEventListener('click', () => this.restartGame());
        // Керування клавіатурою
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        document.addEventListener('keyup', (e) => this.handleKeyRelease(e));
        // Запобігання втрати фокусу
        window.addEventListener('blur', () => {
            if (this.gameRunning && !this.gamePaused) {
                this.togglePause();
            }
        });
    }
    initializeGame() {
        this.score = 0;
        this.level = 1;
        this.speed = 0;
        this.playerPosition = 170;
        this.enemyCars = [];
        this.enemySpawnTimer = 0;
        this.updateUI();
        this.updatePlayerPosition();
    }
    startGame() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.gamePaused = false;
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.speed = 50;
            this.gameLoop = requestAnimationFrame(() => this.update());
        }
    }
    togglePause() {
        if (this.gameRunning) {
            this.gamePaused = !this.gamePaused;
            this.pauseBtn.textContent = this.gamePaused ? 'Продовжити' : 'Пауза';
            if (!this.gamePaused && this.gameLoop === null) {
                this.gameLoop = requestAnimationFrame(() => this.update());
            }
        }
    }
    resetGame() {
        this.stopGame();
        this.clearEnemyCars();
        this.initializeGame();
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = 'Пауза';
    }
    restartGame() {
        this.gameOverScreen.classList.add('hidden');
        this.resetGame();
    }
    stopGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
            this.gameLoop = null;
        }
    }
    gameOver() {
        this.stopGame();
        this.finalScoreElement.textContent = this.score.toString();
        this.gameOverScreen.classList.remove('hidden');
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.pauseBtn.textContent = 'Пауза';
    }
    handleKeyPress(e) {
        if (!this.gameRunning || this.gamePaused)
            return;
        switch (e.key.toLowerCase()) {
            case 'arrowleft':
            case 'a':
                e.preventDefault();
                this.movePlayer(-20);
                break;
            case 'arrowright':
            case 'd':
                e.preventDefault();
                this.movePlayer(20);
                break;
        }
    }
    handleKeyRelease(e) {
        // Можна додати логіку для плавного руху
    }
    movePlayer(direction) {
        const newPosition = this.playerPosition + direction;
        const minPosition = 20;
        const maxPosition = this.roadWidth - this.carWidth - 20;
        if (newPosition >= minPosition && newPosition <= maxPosition) {
            this.playerPosition = newPosition;
            this.updatePlayerPosition();
        }
    }
    updatePlayerPosition() {
        this.playerCar.style.left = `${this.playerPosition}px`;
    }
    createEnemyCar() {
        const enemyCarElement = document.createElement('div');
        enemyCarElement.className = 'enemy-car';
        enemyCarElement.innerHTML = `
            <div class="car-body">
                <div class="car-window"></div>
            </div>
        `;
        const lanes = [50, 135, 220, 290];
        const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
        enemyCarElement.style.left = `${randomLane}px`;
        enemyCarElement.style.top = '-120px';
        this.road.appendChild(enemyCarElement);
        const enemyCar = {
            element: enemyCarElement,
            position: { x: randomLane, y: -120 },
            speed: this.speed + Math.random() * 20 + 20
        };
        this.enemyCars.push(enemyCar);
    }
    updateEnemyCars() {
        this.enemyCars.forEach((car, index) => {
            car.position.y += car.speed * 0.016; // 60 FPS
            car.element.style.top = `${car.position.y}px`;
            // Видалення автомобілів, що виїхали за межі
            if (car.position.y > window.innerHeight) {
                this.road.removeChild(car.element);
                this.enemyCars.splice(index, 1);
                this.score += 10;
            }
        });
    }
    checkCollisions() {
        const playerRect = this.getCarRect(this.playerPosition, window.innerHeight - 170);
        this.enemyCars.forEach(car => {
            const enemyRect = this.getCarRect(car.position.x, car.position.y);
            if (this.isColliding(playerRect, enemyRect)) {
                this.playerCar.classList.add('collision');
                setTimeout(() => {
                    this.playerCar.classList.remove('collision');
                }, 300);
                this.gameOver();
            }
        });
    }
    getCarRect(x, y) {
        return {
            left: x,
            right: x + this.carWidth,
            top: y,
            bottom: y + 120
        };
    }
    isColliding(rect1, rect2) {
        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    }
    updateGameLogic() {
        // Збільшення швидкості та рівня
        this.speed = Math.min(50 + this.score * 0.1, 150);
        this.level = Math.floor(this.score / 100) + 1;
        // Створення ворожих автомобілів
        this.enemySpawnTimer++;
        const spawnRate = Math.max(60 - this.level * 5, 20); // Чим вищий рівень, тим частіше з'являються автомобілі
        if (this.enemySpawnTimer >= spawnRate) {
            this.createEnemyCar();
            this.enemySpawnTimer = 0;
        }
        // Оновлення позицій
        this.updateEnemyCars();
        this.checkCollisions();
        this.updateUI();
    }
    updateUI() {
        this.scoreElement.textContent = this.score.toString();
        this.speedElement.textContent = Math.round(this.speed).toString();
        this.levelElement.textContent = this.level.toString();
    }
    clearEnemyCars() {
        this.enemyCars.forEach(car => {
            if (car.element.parentNode) {
                this.road.removeChild(car.element);
            }
        });
        this.enemyCars = [];
    }
    update() {
        if (this.gameRunning && !this.gamePaused) {
            this.updateGameLogic();
            this.gameLoop = requestAnimationFrame(() => this.update());
        }
        else {
            this.gameLoop = null;
        }
    }
}
// Ініціалізація гри після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    new RacingGame();
});
