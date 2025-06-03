export declare class HabitTrackerCalendar {
    private habits;
    private habitEntries;
    private currentStartDate;
    private readonly daysToShow;
    private readonly colors;
    constructor();
    /**
     * Initialize event listeners
     */
    private initEventListeners;
    /**
     * Add new habit
     */
    private addHabit;
    /**
     * Delete habit (public method for onclick handlers)
     */
    deleteHabit(id: string): void;
    /**
     * Toggle habit completion (public method for onclick handlers)
     */
    toggleHabit(habitId: string, dateStr: string): void;
    /**
     * Navigate days forward or backward
     */
    private navigateDays;
    /**
     * Go to today
     */
    private goToToday;
    /**
     * Get current dates array
     */
    private getDatesArray;
    /**
     * Render all UI components
     */
    private render;
    /**
     * Render habits management sidebar
     */
    private renderHabitsManagement;
    /**
     * Render calendar (headers + grid)
     */
    private renderCalendar;
    /**
     * Render date headers
     */
    private renderDateHeaders;
    /**
     * Render calendar grid
     */
    private renderCalendarGrid;
    /**
     * Update statistics
     */
    private updateStats;
    /**
     * Save data using DataManager
     */
    private saveData;
    /**
     * Load data using DataManager
     */
    private loadData;
}
