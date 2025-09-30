import { Component, OnInit } from '@angular/core';
import { Todo, Task } from '../services/todo';

@Component({
    selector: 'app-todo-list',
    standalone: false,
    templateUrl: './todo-list.html',
    styleUrl: './todo-list.css'
})
export class TodoList implements OnInit {
    tasks: Task[] = [];
    taskInput: string = '';
    completionDate: string = '';
    editingTask: number | null = null;
    editTaskName: string = '';
    editDate: string = '';
    draggedItem: Task | null = null;

    constructor(private todoService: Todo) { }

    ngOnInit(): void {
        this.fetchTasks();
    }

    fetchTasks(): void {
        this.todoService.getTasks().subscribe({
            next: (tasks) => {
                this.tasks = tasks;
            },
            error: (error) => {
                console.error('Error fetching tasks:', error);
            }
        });
    }

    addTask(): void {
        if (!this.taskInput.trim()) return;

        const newTask = {
            task: this.taskInput.trim(),
            completed: false,
            completionDate: this.completionDate || new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString()
        };

        this.todoService.addTask(newTask).subscribe({
            next: () => {
                this.taskInput = '';
                this.completionDate = '';
                this.fetchTasks();
            },
            error: (error) => {
                console.error('Error adding task:', error);
            }
        });
    }

    toggleComplete(task: Task): void {
        this.todoService.updateTask(task.id, { completed: !task.completed }).subscribe({
            next: () => {
                this.fetchTasks();
            },
            error: (error) => {
                console.error('Error toggling task:', error);
            }
        });
    }

    deleteTask(taskId: number): void {
        this.todoService.deleteTask(taskId).subscribe({
            next: () => {
                this.fetchTasks();
            },
            error: (error) => {
                console.error('Error deleting task:', error);
            }
        });
    }

    startEdit(task: Task): void {
        this.editingTask = task.id;
        this.editTaskName = task.task;
        this.editDate = new Date(task.completionDate).toISOString().slice(0, 16);
    }

    saveEdit(): void {
        if (this.editingTask === null) return;

        this.todoService.updateTask(this.editingTask, {
            task: this.editTaskName,
            completionDate: this.editDate
        }).subscribe({
            next: () => {
                this.editingTask = null;
                this.fetchTasks();
            },
            error: (error) => {
                console.error('Error editing task:', error);
            }
        });
    }

    cancelEdit(): void {
        this.editingTask = null;
    }

    onDragStart(task: Task): void {
        this.draggedItem = task;
    }

    onDrop(dropIndex: number): void {
        if (!this.draggedItem) return;

        const dragIndex = this.tasks.findIndex(task => task.id === this.draggedItem!.id);
        if (dragIndex === dropIndex) return;

        const newTasks = [...this.tasks];
        const [draggedTask] = newTasks.splice(dragIndex, 1);
        newTasks.splice(dropIndex, 0, draggedTask);

        const newOrder = newTasks.map(task => task.id);
        this.tasks = newTasks;

        this.todoService.reorderTasks(newOrder).subscribe({
            next: () => {
                this.fetchTasks();
            },
            error: (error) => {
                console.error('Error reordering tasks:', error);
            }
        });

        this.draggedItem = null;
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
    }

    formatDate(date: string | Date): string {
        return new Date(date).toLocaleString();
    }
}
