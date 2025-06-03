interface Habit {
    id: string;
    name: string;
    completed: boolean;
    streak: number;
    createdAt: Date;
    lastCompleted?: Date;
}
declare class HabitTracker {
    private habits;
    constructor();
    private initEventListeners;
    private addHabit;
    deleteHabit(id: string): void;
    toggleHabit(id: string): void;
    private renderHabits;
    private updateStats;
    private saveHabits;
    private loadHabits;
    private generateId;
    private getDayWord;
    private escapeHtml;
    private showAlert;
}
declare let habitTracker: HabitTracker;
//# sourceMappingURL=main.d.ts.map