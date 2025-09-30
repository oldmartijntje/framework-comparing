const API_URL = 'http://localhost:3000/tasks';

export interface Task {
    id: number;
    task: string;
    completed: boolean;
    completionDate: string | Date;
}

export class TodoService {
    async getTasks(): Promise<Task[]> {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        return response.json();
    }

    async addTask(task: Omit<Task, 'id'>): Promise<Task> {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task)
        });
        if (!response.ok) {
            throw new Error('Failed to add task');
        }
        return response.json();
    }

    async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates)
        });
        if (!response.ok) {
            throw new Error('Failed to update task');
        }
        return response.json();
    }

    async deleteTask(id: number): Promise<Task> {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
        return response.json();
    }

    async reorderTasks(order: number[]): Promise<Task[]> {
        const response = await fetch(`${API_URL}/reorder`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ order })
        });
        if (!response.ok) {
            throw new Error('Failed to reorder tasks');
        }
        return response.json();
    }
}

export const todoService = new TodoService();
