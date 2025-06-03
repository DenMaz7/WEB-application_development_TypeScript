export class Utils {
    static generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    static escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    static formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    static isToday(date: Date): boolean {
        const today = new Date();
        return this.formatDate(date) === this.formatDate(today);
    }

    static getDateDaysAgo(days: number): Date {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date;
    }

    static showAlert(message: string, type: 'success' | 'warning' | 'info' | 'danger'): void {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(alertDiv);

        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 3000);
    }

    static getDatesArray(startDate: Date, count: number): Date[] {
        const dates: Date[] = [];
        for (let i = 0; i < count; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            dates.push(date);
        }
        return dates;
    }
}