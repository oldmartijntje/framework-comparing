import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
    id: number;
    task: string;
    completed: boolean;
    completionDate: string | Date;
}

@Injectable({
    providedIn: 'root'
})
export class Todo {
    private apiUrl = 'http://localhost:3000/tasks';

    constructor(private http: HttpClient) { }

    getTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(this.apiUrl);
    }

    addTask(task: Omit<Task, 'id'>): Observable<Task> {
        return this.http.post<Task>(this.apiUrl, task);
    }

    updateTask(id: number, updates: Partial<Task>): Observable<Task> {
        return this.http.put<Task>(`${this.apiUrl}/${id}`, updates);
    }

    deleteTask(id: number): Observable<Task> {
        return this.http.delete<Task>(`${this.apiUrl}/${id}`);
    }

    reorderTasks(order: number[]): Observable<Task[]> {
        return this.http.patch<Task[]>(`${this.apiUrl}/reorder`, { order });
    }
}
