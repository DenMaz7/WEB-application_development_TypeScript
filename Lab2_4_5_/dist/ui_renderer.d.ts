import { Habit, HabitEntry } from '../dist/interfaces.js';
export declare class UIRenderer {
    /**
     * Render habits management sidebar
     */
    static renderHabitsManagement(habits: Habit[]): void;
    /**
     * Render date headers
     */
    static renderDateHeaders(dates: Date[]): void;
    /**
     * Render calendar grid with habits
     */
    static renderCalendarGrid(habits: Habit[], habitEntries: HabitEntry[], dates: Date[]): void;
    /**
     * Update statistics display
     */
    static updateStats(habits: Habit[], habitEntries: HabitEntry[]): void;
}
