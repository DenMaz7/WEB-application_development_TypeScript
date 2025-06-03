// Main Habit Tracker Calendar class
import { Utils } from '../dist/utils.js';
import { DataManager } from '../dist/data_manager.js';
import { UIRenderer } from '../dist/ui_renderer.js';
export class HabitTrackerCalendar {
    constructor() {
        this.habits = [];
        this.habitEntries = [];
        this.daysToShow = 10;
        this.colors = [
            '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8',
            '#6f42c1', '#e83e8c', '#fd7e14', '#20c997', '#6c757d'
        ];
        this.currentStartDate = Utils.getDateDaysAgo(9); // Show 10 days ending with today
        this.loadData();
        this.initEventListeners();
        this.render();
    }
    /**
     * Initialize event listeners
     */
    initEventListeners() {
        const addBtn = document.getElementById('addHabitBtn');
        const input = document.getElementById('newHabitInput');
        const prevBtn = document.getElementById('prevDaysBtn');
        const nextBtn = document.getElementById('nextDaysBtn');
        const todayBtn = document.getElementById('todayBtn');
        addBtn?.addEventListener('click', () => this.addHabit());
        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addHabit();
            }
        });
        prevBtn?.addEventListener('click', () => this.navigateDays(-this.daysToShow));
        nextBtn?.addEventListener('click', () => this.navigateDays(this.daysToShow));
        todayBtn?.addEventListener('click', () => this.goToToday());
    }
    /**
     * Add new habit
     */
    addHabit() {
        const input = document.getElementById('newHabitInput');
        const habitName = input.value.trim();
        if (!habitName) {
            Utils.showAlert('Будь ласка, введіть назву звички!', 'warning');
            return;
        }
        if (this.habits.some(habit => habit.name.toLowerCase() === habitName.toLowerCase())) {
            Utils.showAlert('Така звичка вже існує!', 'warning');
            return;
        }
        const newHabit = {
            id: Utils.generateId(),
            name: habitName,
            color: this.colors[this.habits.length % this.colors.length],
            createdAt: new Date()
        };
        this.habits.push(newHabit);
        this.saveData();
        this.render();
        input.value = '';
        Utils.showAlert('Звичку додано успішно!', 'success');
    }
    /**
     * Delete habit (public method for onclick handlers)
     */
    deleteHabit(id) {
        if (confirm('Ви впевнені, що хочете видалити цю звичку? Всі записи будуть втрачені.')) {
            this.habits = this.habits.filter(habit => habit.id !== id);
            this.habitEntries = this.habitEntries.filter(entry => entry.habitId !== id);
            this.saveData();
            this.render();
            Utils.showAlert('Звичку видалено!', 'info');
        }
    }
    /**
     * Toggle habit completion (public method for onclick handlers)
     */
    toggleHabit(habitId, dateStr) {
        const date = new Date(dateStr);
        const today = new Date();
        // Don't allow editing future dates
        if (date > today) {
            return;
        }
        const existingEntry = this.habitEntries.find(entry => entry.habitId === habitId && entry.date === dateStr);
        if (existingEntry) {
            existingEntry.completed = !existingEntry.completed;
        }
        else {
            this.habitEntries.push({
                habitId,
                date: dateStr,
                completed: true
            });
        }
        this.saveData();
        this.renderCalendarGrid();
        this.updateStats();
    }
    /**
     * Navigate days forward or backward
     */
    navigateDays(days) {
        this.currentStartDate = new Date(this.currentStartDate.getTime() + days * 24 * 60 * 60 * 1000);
        this.renderCalendar();
    }
    /**
     * Go to today
     */
    goToToday() {
        this.currentStartDate = Utils.getDateDaysAgo(9);
        this.renderCalendar();
    }
    /**
     * Get current dates array
     */
    getDatesArray() {
        return Utils.getDatesArray(this.currentStartDate, this.daysToShow);
    }
    /**
     * Render all UI components
     */
    render() {
        this.renderHabitsManagement();
        this.renderCalendar();
        this.updateStats();
    }
    /**
     * Render habits management sidebar
     */
    renderHabitsManagement() {
        UIRenderer.renderHabitsManagement(this.habits);
    }
    /**
     * Render calendar (headers + grid)
     */
    renderCalendar() {
        this.renderDateHeaders();
        this.renderCalendarGrid();
    }
    /**
     * Render date headers
     */
    renderDateHeaders() {
        const dates = this.getDatesArray();
        UIRenderer.renderDateHeaders(dates);
    }
    /**
     * Render calendar grid
     */
    renderCalendarGrid() {
        const dates = this.getDatesArray();
        UIRenderer.renderCalendarGrid(this.habits, this.habitEntries, dates);
    }
    /**
     * Update statistics
     */
    updateStats() {
        UIRenderer.updateStats(this.habits, this.habitEntries);
    }
    /**
     * Save data using DataManager
     */
    saveData() {
        DataManager.saveData(this.habits, this.habitEntries);
    }
    /**
     * Load data using DataManager
     */
    loadData() {
        const data = DataManager.loadData();
        this.habits = data.habits;
        this.habitEntries = data.habitEntries;
    }
}
// Initialize the habit tracker when the page loads
let habitTracker;
document.addEventListener('DOMContentLoaded', () => {
    habitTracker = new HabitTrackerCalendar();
    // Make habitTracker globally accessible for onclick handlers
    window.habitTracker = habitTracker;
});
