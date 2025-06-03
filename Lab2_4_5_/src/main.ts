import { Habit, HabitEntry } from '../dist/interfaces.js';
import { Utils } from '../dist/utils.js';
import { DataManager } from '../dist/data_manager.js';
import { UIRenderer } from '../dist/ui_renderer.js';

export class HabitTrackerCalendar {
    private habits: Habit[] = [];
    private habitEntries: HabitEntry[] = [];
    private currentStartDate: Date;
    private readonly daysToShow: number = 10;
    private readonly colors: string[] = [
        '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8',
        '#6f42c1', '#e83e8c', '#fd7e14', '#20c997', '#6c757d'
    ];

    constructor() {
        this.currentStartDate = Utils.getDateDaysAgo(9); 
        this.loadData();
        this.initEventListeners();
        this.render();
    }

    private initEventListeners(): void {
        const addBtn = document.getElementById('addHabitBtn') as HTMLButtonElement;
        const input = document.getElementById('newHabitInput') as HTMLInputElement;
        const prevBtn = document.getElementById('prevDaysBtn') as HTMLButtonElement;
        const nextBtn = document.getElementById('nextDaysBtn') as HTMLButtonElement;
        const todayBtn = document.getElementById('todayBtn') as HTMLButtonElement;

        addBtn?.addEventListener('click', () => this.addHabit());
        input?.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                this.addHabit();
            }
        });

        prevBtn?.addEventListener('click', () => this.navigateDays(-this.daysToShow));
        nextBtn?.addEventListener('click', () => this.navigateDays(this.daysToShow));
        todayBtn?.addEventListener('click', () => this.goToToday());
    }

    private addHabit(): void {
        const input = document.getElementById('newHabitInput') as HTMLInputElement;
        const habitName = input.value.trim();

        if (!habitName) {
            Utils.showAlert('Будь ласка, введіть назву звички!', 'warning');
            return;
        }

        if (this.habits.some(habit => habit.name.toLowerCase() === habitName.toLowerCase())) {
            Utils.showAlert('Така звичка вже існує!', 'warning');
            return;
        }

        const newHabit: Habit = {
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

    public deleteHabit(id: string): void {
        if (confirm('Ви впевнені, що хочете видалити цю звичку? Всі записи будуть втрачені.')) {
            this.habits = this.habits.filter(habit => habit.id !== id);
            this.habitEntries = this.habitEntries.filter(entry => entry.habitId !== id);
            this.saveData();
            this.render();
            Utils.showAlert('Звичку видалено!', 'info');
        }
    }

    public toggleHabit(habitId: string, dateStr: string): void {
        const date = new Date(dateStr);
        const today = new Date();
        
        if (date > today) {
            return;
        }

        const existingEntry = this.habitEntries.find(
            entry => entry.habitId === habitId && entry.date === dateStr
        );

        if (existingEntry) {
            existingEntry.completed = !existingEntry.completed;
        } else {
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

    private navigateDays(days: number): void {
        this.currentStartDate = new Date(this.currentStartDate.getTime() + days * 24 * 60 * 60 * 1000);
        this.renderCalendar();
    }

    private goToToday(): void {
        this.currentStartDate = Utils.getDateDaysAgo(9);
        this.renderCalendar();
    }

    private getDatesArray(): Date[] {
        return Utils.getDatesArray(this.currentStartDate, this.daysToShow);
    }

    private render(): void {
        this.renderHabitsManagement();
        this.renderCalendar();
        this.updateStats();
    }

    private renderHabitsManagement(): void {
        UIRenderer.renderHabitsManagement(this.habits);
    }

    private renderCalendar(): void {
        this.renderDateHeaders();
        this.renderCalendarGrid();
    }

    private renderDateHeaders(): void {
        const dates = this.getDatesArray();
        UIRenderer.renderDateHeaders(dates);
    }

    private renderCalendarGrid(): void {
        const dates = this.getDatesArray();
        UIRenderer.renderCalendarGrid(this.habits, this.habitEntries, dates);
    }

    private updateStats(): void {
        UIRenderer.updateStats(this.habits, this.habitEntries);
    }

    private saveData(): void {
        DataManager.saveData(this.habits, this.habitEntries);
    }

    private loadData(): void {
        const data = DataManager.loadData();
        this.habits = data.habits;
        this.habitEntries = data.habitEntries;
    }
}

let habitTracker: HabitTrackerCalendar;

document.addEventListener('DOMContentLoaded', () => {
    habitTracker = new HabitTrackerCalendar();
    (window as any).habitTracker = habitTracker;
});