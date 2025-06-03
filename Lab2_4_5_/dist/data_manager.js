// Data management for Habit Tracker Calendar
import { Utils } from '../dist/utils.js';
export class DataManager {
    /**
     * Save habits and entries to storage
     */
    static saveData(habits, habitEntries) {
        try {
            const data = {
                habits: habits.map(habit => ({
                    ...habit,
                    createdAt: habit.createdAt
                })),
                habitEntries: habitEntries
            };
            // In a real application, this would use localStorage
            // localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            console.log('Data saved:', data);
        }
        catch (error) {
            console.error('Error saving data:', error);
        }
    }
    /**
     * Load habits and entries from storage
     */
    static loadData() {
        try {
            // In a real application, this would load from localStorage
            // const savedData = localStorage.getItem(this.STORAGE_KEY);
            // if (savedData) {
            //     const data: HabitData = JSON.parse(savedData);
            //     return {
            //         habits: data.habits.map(habit => ({
            //             ...habit,
            //             createdAt: new Date(habit.createdAt)
            //         })),
            //         habitEntries: data.habitEntries
            //     };
            // }
            // For demo purposes, return sample data
            return this.getSampleData();
        }
        catch (error) {
            console.error('Error loading data:', error);
            return { habits: [], habitEntries: [] };
        }
    }
    /**
     * Generate sample data for demo
     */
    static getSampleData() {
        const habits = [
            {
                id: '1',
                name: 'Випити воду',
                color: '#007bff',
                createdAt: new Date()
            },
            {
                id: '2',
                name: 'Зробити зарядку',
                color: '#28a745',
                createdAt: new Date()
            },
            {
                id: '3',
                name: 'Почитати книгу',
                color: '#dc3545',
                createdAt: new Date()
            }
        ];
        const habitEntries = [];
        const today = new Date();
        // Add some sample entries for the last 5 days
        for (let i = 0; i < 5; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = Utils.formatDate(date);
            // Random completion for demo
            habits.forEach(habit => {
                if (Math.random() > 0.4) {
                    habitEntries.push({
                        habitId: habit.id,
                        date: dateStr,
                        completed: true
                    });
                }
            });
        }
        return { habits, habitEntries };
    }
    /**
     * Calculate habit streak
     */
    static getHabitStreak(habitEntries, habitId, endDate) {
        let streak = 0;
        let currentDate = new Date(endDate);
        while (true) {
            const dateStr = Utils.formatDate(currentDate);
            const entry = habitEntries.find(e => e.habitId === habitId && e.date === dateStr);
            if (entry && entry.completed) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            }
            else {
                break;
            }
        }
        return streak;
    }
}
DataManager.STORAGE_KEY = 'habit-tracker-data';
