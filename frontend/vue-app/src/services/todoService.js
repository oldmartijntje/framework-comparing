const API_URL = 'http://localhost:3000/tasks'

export const todoService = {
    async getTasks() {
        const response = await fetch(API_URL)
        if (!response.ok) {
            throw new Error('Failed to fetch tasks')
        }
        return response.json()
    },

    async addTask(task) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task)
        })
        if (!response.ok) {
            throw new Error('Failed to add task')
        }
        return response.json()
    },

    async updateTask(id, updates) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates)
        })
        if (!response.ok) {
            throw new Error('Failed to update task')
        }
        return response.json()
    },

    async deleteTask(id) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })
        if (!response.ok) {
            throw new Error('Failed to delete task')
        }
        return response.json()
    },

    async reorderTasks(order) {
        const response = await fetch(`${API_URL}/reorder`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ order })
        })
        if (!response.ok) {
            throw new Error('Failed to reorder tasks')
        }
        return response.json()
    }
}
