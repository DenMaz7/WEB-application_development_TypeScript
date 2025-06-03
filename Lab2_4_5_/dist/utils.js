// Utility functions for Habit Tracker Calendar
export class Utils {
    /**
     * Generate unique ID
     */
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    /**
     * Escape HTML to prevent XSS
     */
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    /**
     * Format date to YYYY-MM-DD string
     */
    static formatDate(date) {
        return date.toISOString().split('T')[0];
    }
    /**
     * Check if date is today
     */
    static isToday(date) {
        const today = new Date();
        return this.formatDate(date) === this.formatDate(today);
    }
    /**
     * Get date N days ago
     */
    static getDateDaysAgo(days) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date;
    }
    /**
     * Show alert notification
     */
    static showAlert(message, type) {
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
    /**
     * Get array of dates starting from startDate
     */
    static getDatesArray(startDate, count) {
        const dates = [];
        for (let i = 0; i < count; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            dates.push(date);
        }
        return dates;
    }
}
