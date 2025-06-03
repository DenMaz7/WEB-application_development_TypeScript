"use strict";
// TypeScript for Habit Tracker
class HabitTracker {
    constructor() {
        this.habits = [];
        this.loadHabits();
        this.initEventListeners();
        this.renderHabits();
        this.updateStats();
    }
    initEventListeners() {
        const addBtn = document.getElementById('addHabitBtn');
        const input = document.getElementById('newHabitInput');
        addBtn?.addEventListener('click', () => this.addHabit());
        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addHabit();
            }
        });
    }
    addHabit() {
        const input = document.getElementById('newHabitInput');
        const habitName = input.value.trim();
        if (!habitName) {
            this.showAlert('Будь ласка, введіть назву звички!', 'warning');
            return;
        }
        if (this.habits.some(habit => habit.name.toLowerCase() === habitName.toLowerCase())) {
            this.showAlert('Така звичка вже існує!', 'warning');
            return;
        }
        const newHabit = {
            id: this.generateId(),
            name: habitName,
            completed: false,
            streak: 0,
            createdAt: new Date()
        };
        this.habits.push(newHabit);
        this.saveHabits();
        this.renderHabits();
        this.updateStats();
        input.value = '';
        this.showAlert('Звичку додано успішно!', 'success');
    }
    deleteHabit(id) {
        if (confirm('Ви впевнені, що хочете видалити цю звичку?')) {
            this.habits = this.habits.filter(habit => habit.id !== id);
            this.saveHabits();
            this.renderHabits();
            this.updateStats();
            this.showAlert('Звичку видалено!', 'info');
        }
    }
    toggleHabit(id) {
        const habit = this.habits.find(h => h.id === id);
        if (!habit)
            return;
        const today = new Date().toDateString();
        const lastCompleted = habit.lastCompleted?.toDateString();
        if (habit.completed && lastCompleted === today) {
            // Uncomplete today's habit
            habit.completed = false;
            habit.streak = Math.max(0, habit.streak - 1);
        }
        else if (!habit.completed) {
            // Complete habit
            habit.completed = true;
            habit.lastCompleted = new Date();
            // Update streak
            if (lastCompleted === new Date(Date.now() - 86400000).toDateString()) {
                // Consecutive day
                habit.streak += 1;
            }
            else if (lastCompleted !== today) {
                // First time or after a break
                habit.streak = 1;
            }
        }
        this.saveHabits();
        this.renderHabits();
        this.updateStats();
    }
    renderHabits() {
        const habitsList = document.getElementById('habitsList');
        const emptyState = document.getElementById('emptyState');
        if (this.habits.length === 0) {
            habitsList.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        emptyState.style.display = 'none';
        const today = new Date().toDateString();
        habitsList.innerHTML = this.habits.map(habit => {
            const isCompletedToday = habit.completed &&
                habit.lastCompleted?.toDateString() === today;
            return `
                <div class="habit-item ${isCompletedToday ? 'completed' : ''}">
                    <div class="habit-name">${this.escapeHtml(habit.name)}</div>
                    <div class="habit-streak">
                        <i class="bi bi-fire"></i>
                        Серія: ${habit.streak} ${this.getDayWord(habit.streak)}
                    </div>
                    <div class="habit-actions">
                        <div class="habit-status">
                            <button class="btn btn-sm ${isCompletedToday ? 'btn-completed' : 'btn-complete'}"
                                    onclick="habitTracker.toggleHabit('${habit.id}')">
                                <i class="bi ${isCompletedToday ? 'bi-check-circle-fill' : 'bi-circle'}"></i>
                                ${isCompletedToday ? 'Виконано' : 'Виконати'}
                            </button>
                        </div>
                        <button class="btn btn-sm btn-delete"
                                onclick="habitTracker.deleteHabit('${habit.id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
    updateStats() {
        const today = new Date().toDateString();
        const totalHabits = this.habits.length;
        const completedToday = this.habits.filter(habit => habit.completed && habit.lastCompleted?.toDateString() === today).length;
        const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
        const totalElement = document.getElementById('totalHabits');
        const completedElement = document.getElementById('completedToday');
        const rateElement = document.getElementById('completionRate');
        if (totalElement)
            totalElement.textContent = totalHabits.toString();
        if (completedElement)
            completedElement.textContent = completedToday.toString();
        if (rateElement)
            rateElement.textContent = `${completionRate}%`;
    }
    saveHabits() {
        try {
            const habitsJson = JSON.stringify(this.habits.map(habit => ({
                ...habit,
                createdAt: habit.createdAt.toISOString(),
                lastCompleted: habit.lastCompleted?.toISOString()
            })));
            // In a real application, this would use localStorage or a backend API
            // For demo purposes, we'll store in memory only
            console.log('Habits saved:', habitsJson);
        }
        catch (error) {
            console.error('Error saving habits:', error);
        }
    }
    loadHabits() {
        try {
            // In a real application, this would load from localStorage or a backend API
            // For demo purposes, we'll start with empty habits
            this.habits = [];
        }
        catch (error) {
            console.error('Error loading habits:', error);
            this.habits = [];
        }
    }
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    getDayWord(count) {
        const lastDigit = count % 10;
        const lastTwoDigits = count % 100;
        if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
            return 'днів';
        }
        switch (lastDigit) {
            case 1:
                return 'день';
            case 2:
            case 3:
            case 4:
                return 'дні';
            default:
                return 'днів';
        }
    }
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    showAlert(message, type) {
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alertDiv);
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 3000);
    }
}
// Initialize the habit tracker when the page loads
let habitTracker;
document.addEventListener('DOMContentLoaded', () => {
    habitTracker = new HabitTracker();
    // Make habitTracker globally accessible for onclick handlers
    window.habitTracker = habitTracker;
});
//# sourceMappingURL=main.js.map