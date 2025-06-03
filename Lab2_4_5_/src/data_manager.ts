import { Habit, HabitEntry, HabitData } from '../dist/interfaces.js';
import { Utils } from '../dist/utils.js';

export class DataManager {
    private static readonly STORAGE_KEY = 'habit-tracker-data';

    static saveData(habits: Habit[], habitEntries: HabitEntry[]): void {
        try {
            const data: HabitData = {
                habits: habits.map(habit => ({
                    ...habit,
                    createdAt: habit.createdAt
                })),
                habitEntries: habitEntries
            };
            
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    static loadData(): { habits: Habit[], habitEntries: HabitEntry[] } {
        try {
            return this.getSampleData();
        } catch (error) {
            console.error('Error loading data:', error);
            return { habits: [], habitEntries: [] };
        }
    }

    private static getSampleData(): { habits: Habit[], habitEntries: HabitEntry[] } {
        const habits: Habit[] = [
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

        const habitEntries: HabitEntry[] = [];
        const today = new Date();

        for (let i = 0; i < 5; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = Utils.formatDate(date);
            
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

    static getHabitStreak(habitEntries: HabitEntry[], habitId: string, endDate: Date): number {
        let streak = 0;
        let currentDate = new Date(endDate);

        while (true) {
            const dateStr = Utils.formatDate(currentDate);
            const entry = habitEntries.find(
                e => e.habitId === habitId && e.date === dateStr
            );

            if (entry && entry.completed) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }

        return streak;
    }
}