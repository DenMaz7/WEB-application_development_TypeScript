export declare class Utils {
    /**
     * Generate unique ID
     */
    static generateId(): string;
    /**
     * Escape HTML to prevent XSS
     */
    static escapeHtml(text: string): string;
    /**
     * Format date to YYYY-MM-DD string
     */
    static formatDate(date: Date): string;
    /**
     * Check if date is today
     */
    static isToday(date: Date): boolean;
    /**
     * Get date N days ago
     */
    static getDateDaysAgo(days: number): Date;
    /**
     * Show alert notification
     */
    static showAlert(message: string, type: 'success' | 'warning' | 'info' | 'danger'): void;
    /**
     * Get array of dates starting from startDate
     */
    static getDatesArray(startDate: Date, count: number): Date[];
}
