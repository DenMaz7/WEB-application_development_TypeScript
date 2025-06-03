export interface Habit {
    id: string;
    name: string;
    color: string;
    createdAt: Date;
}
export interface HabitEntry {
    habitId: string;
    date: string;
    completed: boolean;
}
export interface HabitData {
    habits: Habit[];
    habitEntries: HabitEntry[];
}
export type AlertType = 'success' | 'warning' | 'info' | 'danger';
