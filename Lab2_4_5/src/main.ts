// main.ts - точка входу до додатка
import { Router } from './router.js';
import { ChessGame } from './board.js';
import { GameHistory } from './history.js';

// Глобальні змінні для доступу з HTML
declare global {
    interface Window {
        router: Router;
        game: ChessGame;
        gameHistory: GameHistory;
    }
}

// Ініціалізація додатка
class App {
    private router: Router;
    private game: ChessGame;
    private gameHistory: GameHistory;

    constructor() {
        this.router = new Router();
        this.game = new ChessGame();
        this.gameHistory = new GameHistory();
        
        // Робимо об'єкти доступними глобально для HTML подій
        window.router = this.router;
        window.game = this.game;
        window.gameHistory = this.gameHistory;
        
        this.init();
    }

    private init(): void {
        // Налаштування маршрутів
        this.router.addRoute('main-menu', () => this.showMainMenu());
        this.router.addRoute('local-game', () => this.startLocalGame());
        this.router.addRoute('bot-game', () => this.startBotGame());
        this.router.addRoute('history', () => this.showHistory());

        // Запуск роутера
        this.router.init();
        
        // Налаштування обробників подій
        this.setupEventListeners();
        
        console.log('🎮 Chess Online додаток ініціалізовано!');
    }

    private setupEventListeners(): void {
        // Головне меню
        const localGameBtn = document.getElementById('local-game-btn');
        const botGameBtn = document.getElementById('bot-game-btn');
        const historyBtn = document.getElementById('history-btn');
        
        if (localGameBtn) localGameBtn.addEventListener('click', () => this.router.navigate('local-game'));
        if (botGameBtn) botGameBtn.addEventListener('click', () => this.router.navigate('bot-game'));
        if (historyBtn) historyBtn.addEventListener('click', () => this.router.navigate('history'));

        // Кнопки "До меню"
        const menuBtns = ['menu-btn-1', 'menu-btn-2', 'menu-btn-3', 'menu-btn-4'];
        menuBtns.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) btn.addEventListener('click', () => this.router.navigate('main-menu'));
        });

        // Кнопка "Нова гра"
        const newGameBtn = document.getElementById('new-game-btn');
        if (newGameBtn) newGameBtn.addEventListener('click', () => this.game.newGame());

        // Кнопка "Історія" в грі
        const historyBtn2 = document.getElementById('history-btn-2');
        if (historyBtn2) historyBtn2.addEventListener('click', () => this.router.navigate('history'));
    }

    private showMainMenu(): void {
        this.hideAllPages();
        this.showPage('main-menu');
        // Переналаштовуємо обробники після показу сторінки
        setTimeout(() => this.setupEventListeners(), 0);
    }

    private startLocalGame(): void {
        this.hideAllPages();
        this.showPage('game-page');
        this.game.startGame('local');
        // Переналаштовуємо обробники після показу сторінки
        setTimeout(() => this.setupEventListeners(), 0);
    }

    private startBotGame(): void {
        this.hideAllPages();
        this.showPage('game-page');
        this.game.startGame('bot');
        // Переналаштовуємо обробники після показу сторінки
        setTimeout(() => this.setupEventListeners(), 0);
    }

    private async showHistory(): Promise<void> {
        this.hideAllPages();
        this.showPage('history-page');
        await this.gameHistory.displayHistory();
        // Переналаштовуємо обробники після показу сторінки
        setTimeout(() => this.setupEventListeners(), 0);
    }

    private hideAllPages(): void {
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.add('hidden'));
    }

    private showPage(pageId: string): void {
        const page = document.getElementById(pageId);
        if (page) {
            page.classList.remove('hidden');
        }
    }
}

// Запуск додатка після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

export { App };