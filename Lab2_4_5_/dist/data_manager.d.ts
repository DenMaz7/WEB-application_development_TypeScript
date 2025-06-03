import { Habit, HabitEntry } from './interfaces.js';
export declare class DataManager {
    private static readonly STORAGE_KEY;
    /**
     * Save habits and entries to storage
     */
    static saveData(habits: Habit[], habitEntries: HabitEntry[]): void;
    /**
     * Load habits and entries from storage
     */
    static loadData(): {
        habits: Habit[];
        habitEntries: HabitEntry[];
    };
    /**
     * Generate sample data for demo
     */
    private static getSampleData;
    /**
     * Calculate habit streak
     */
    static getHabitStreak(habitEntries: HabitEntry[], habitId: string, endDate: Date): number;
}
