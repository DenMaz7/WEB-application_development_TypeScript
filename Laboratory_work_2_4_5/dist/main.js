// main.ts - точка входу до додатка
import { Router } from './router.js';
import { ChessGame } from './board.js';
import { GameHistory } from './history.js';
// Ініціалізація додатка
class App {
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
    init() {
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
    setupEventListeners() {
        console.log('🔧 Налаштування обробників подій...');
        // Головне меню
        const localGameBtn = document.getElementById('local-game-btn');
        const botGameBtn = document.getElementById('bot-game-btn');
        const historyBtn = document.getElementById('history-btn');
        console.log('Кнопки головного меню:', { localGameBtn, botGameBtn, historyBtn });
        if (localGameBtn) {
            localGameBtn.addEventListener('click', () => {
                console.log('🎮 Клік на локальну гру');
                this.router.navigate('local-game');
            });
            console.log('✅ Обробник для локальної гри додано');
        }
        if (botGameBtn) {
            botGameBtn.addEventListener('click', () => {
                console.log('🤖 Клік на гру проти бота');
                this.router.navigate('bot-game');
            });
            console.log('✅ Обробник для гри проти бота додано');
        }
        if (historyBtn) {
            historyBtn.addEventListener('click', () => {
                console.log('📜 Клік на історію');
                this.router.navigate('history');
            });
            console.log('✅ Обробник для історії додано');
        }
        // Кнопки "До меню"
        const menuBtns = ['menu-btn-1', 'menu-btn-2', 'menu-btn-3', 'menu-btn-4'];
        menuBtns.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', () => {
                    console.log('🏠 Клік на повернення до меню');
                    this.router.navigate('main-menu');
                });
                console.log(`✅ Обробник для ${btnId} додано`);
            }
        });
        // Кнопка "Нова гра"
        const newGameBtn = document.getElementById('new-game-btn');
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => {
                console.log('🔄 Клік на нову гру');
                this.game.newGame();
            });
            console.log('✅ Обробник для нової гри додано');
        }
        // Кнопка "Історія" в грі
        const historyBtn2 = document.getElementById('history-btn-2');
        if (historyBtn2) {
            historyBtn2.addEventListener('click', () => {
                console.log('📜 Клік на історію з гри');
                this.router.navigate('history');
            });
            console.log('✅ Обробник для історії з гри додано');
        }
        console.log('🔧 Налаштування обробників завершено');
    }
    showMainMenu() {
        this.hideAllPages();
        this.showPage('main-menu');
        // Переналаштовуємо обробники після показу сторінки
        setTimeout(() => this.setupEventListeners(), 100);
    }
    startLocalGame() {
        this.hideAllPages();
        this.showPage('game-page');
        this.game.startGame('local');
        // Переналаштовуємо обробники після показу сторінки
        setTimeout(() => this.setupEventListeners(), 100);
    }
    startBotGame() {
        this.hideAllPages();
        this.showPage('game-page');
        this.game.startGame('bot');
        // Переналаштовуємо обробники після показу сторінки
        setTimeout(() => this.setupEventListeners(), 100);
    }
    async showHistory() {
        this.hideAllPages();
        this.showPage('history-page');
        await this.gameHistory.displayHistory();
        // Переналаштовуємо обробники після показу сторінки
        setTimeout(() => this.setupEventListeners(), 100);
    }
    hideAllPages() {
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => page.classList.add('hidden'));
    }
    showPage(pageId) {
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
//# sourceMappingURL=main.js.map