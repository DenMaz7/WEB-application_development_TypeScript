import { Habit, HabitEntry } from '../dist/interfaces.js';
import { Utils } from '../dist/utils.js';
import { DataManager } from '../dist/data_manager.js';

export class UIRenderer {
    static renderHabitsManagement(habits: Habit[]): void {
        const container = document.getElementById('habitsManagement') as HTMLElement;
        
        if (habits.length === 0) {
            container.innerHTML = '<p class="text-muted text-center">Поки що немає звичок</p>';
            return;
        }

        container.innerHTML = habits.map(habit => `
            <div class="habit-management-item">
                <div class="habit-color" style="background-color: ${habit.color}"></div>
                <div class="habit-name-mgmt">${Utils.escapeHtml(habit.name)}</div>
                <button class="btn btn-delete btn-sm" onclick="habitTracker.deleteHabit('${habit.id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `).join('');
    }

    static renderDateHeaders(dates: Date[]): void {
        const container = document.getElementById('dateHeaders') as HTMLElement;

        container.innerHTML = dates.map(date => {
            const isToday = Utils.isToday(date);
            const dayName = date.toLocaleDateString('uk-UA', { weekday: 'short' });
            const dayNumber = date.getDate();
            const monthName = date.toLocaleDateString('uk-UA', { month: 'short' });

            return `
                <div class="col">
                    <div class="date-header ${isToday ? 'today' : ''}">
                        <div class="date-day">${dayName}</div>
                        <div class="date-number">${dayNumber}</div>
                        <div class="date-month">${monthName}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    static renderCalendarGrid(habits: Habit[], habitEntries: HabitEntry[], dates: Date[]): void {
        const container = document.getElementById('calendarGrid') as HTMLElement;
        const emptyState = document.getElementById('calendarEmptyState') as HTMLElement;

        if (habits.length === 0) {
            container.innerHTML = '';
            emptyState!.style.display = 'block';
            return;
        }

        emptyState!.style.display = 'none';
        const today = new Date();

        container.innerHTML = habits.map(habit => {
            const habitCells = dates.map(date => {
                const dateStr = Utils.formatDate(date);
                const isToday = Utils.isToday(date);
                const isFuture = date > today;
                const entry = habitEntries.find(
                    e => e.habitId === habit.id && e.date === dateStr
                );
                const isCompleted = entry ? entry.completed : false;
                const streak = DataManager.getHabitStreak(habitEntries, habit.id, date);

                let cellClass = 'habit-cell';
                if (isFuture) cellClass += ' future';
                else if (isCompleted) cellClass += ' completed';
                else if (isToday) cellClass += ' today incomplete';
                else cellClass += ' incomplete';

                const clickHandler = isFuture ? '' : `onclick="habitTracker.toggleHabit('${habit.id}', '${dateStr}')"`;

                return `
                    <div class="col">
                        <div class="${cellClass}" ${clickHandler}>
                            ${streak > 1 ? `<div class="streak-indicator">${streak}</div>` : ''}
                        </div>
                    </div>
                `;
            }).join('');

            return `
                <div class="habit-row">
                    <div class="row g-0">
                        <div class="col-2">
                            <div class="habit-label">
                                <div class="habit-label-color" style="background-color: ${habit.color}"></div>
                                <div class="habit-label-text">${Utils.escapeHtml(habit.name)}</div>
                            </div>
                        </div>
                        <div class="col-10">
                            <div class="row g-0">
                                ${habitCells}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    static updateStats(habits: Habit[], habitEntries: HabitEntry[]): void {
        const today = Utils.formatDate(new Date());
        const totalHabits = habits.length;
        const completedToday = habitEntries.filter(entry => 
            entry.date === today && entry.completed
        ).length;
        const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

        const totalElement = document.getElementById('totalHabits');
        const completedElement = document.getElementById('completedToday');
        const rateElement = document.getElementById('completionRate');

        if (totalElement) totalElement.textContent = totalHabits.toString();
        if (completedElement) completedElement.textContent = completedToday.toString();
        if (rateElement) rateElement.textContent = `${completionRate}%`;
    }
}