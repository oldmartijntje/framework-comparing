import { Component, createSignal, onMount, For } from 'solid-js';

interface Task {
    id: number;
    task: string;
    completed: boolean;
    completionDate: string;
    order: number;
}

const TodoList: Component = () => {
    const [tasks, setTasks] = createSignal<Task[]>([]);
    const [taskInput, setTaskInput] = createSignal('');
    const [completionDate, setCompletionDate] = createSignal('');
    const [editingTask, setEditingTask] = createSignal<number | null>(null);
    const [editTaskName, setEditTaskName] = createSignal('');
    const [editCompletionDate, setEditCompletionDate] = createSignal('');
    const [draggedTask, setDraggedTask] = createSignal<number | null>(null);

    const API_URL = 'http://localhost:3000/tasks';

    const fetchTasks = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    onMount(() => {
        fetchTasks();
    });

    const addTask = async (e: Event) => {
        e.preventDefault();
        const task = taskInput().trim();
        if (!task) return;

        const newTask = {
            task,
            completed: false,
            completionDate: completionDate() || new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString()
        };

        try {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask)
            });
            setTaskInput('');
            setCompletionDate('');
            fetchTasks();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const toggleComplete = async (task: Task) => {
        try {
            await fetch(`${API_URL}/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !task.completed })
            });
            fetchTasks();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const deleteTask = async (id: number) => {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const startEdit = (task: Task) => {
        setEditingTask(task.id);
        setEditTaskName(task.task);
        setEditCompletionDate(new Date(task.completionDate).toISOString().slice(0, 16));
    };

    const cancelEdit = () => {
        setEditingTask(null);
        setEditTaskName('');
        setEditCompletionDate('');
    };

    const saveEdit = async (e: Event) => {
        e.preventDefault();
        const id = editingTask();
        if (!id) return;

        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    task: editTaskName().trim(),
                    completionDate: editCompletionDate()
                })
            });
            cancelEdit();
            fetchTasks();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const saveNewOrder = async (newOrder: number[]) => {
        try {
            await fetch(`${API_URL}/reorder`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order: newOrder })
            });
            fetchTasks();
        } catch (error) {
            console.error('Error reordering tasks:', error);
        }
    };

    const handleDragStart = (taskId: number) => {
        setDraggedTask(taskId);
    };

    const handleDragEnd = () => {
        setDraggedTask(null);
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
    };

    const handleDragEnter = (e: DragEvent) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLElement;
        target.classList.add('drag-over');
    };

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLElement;
        target.classList.remove('drag-over');
    };

    const handleDrop = (e: DragEvent, targetTaskId: number) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLElement;
        target.classList.remove('drag-over');

        const dragged = draggedTask();
        if (!dragged || dragged === targetTaskId) return;

        const currentTasks = tasks();
        const draggedIndex = currentTasks.findIndex(task => task.id === dragged);
        const targetIndex = currentTasks.findIndex(task => task.id === targetTaskId);

        if (draggedIndex === -1 || targetIndex === -1) return;

        // Reorder the tasks array
        const newTasks = [...currentTasks];
        const [draggedItem] = newTasks.splice(draggedIndex, 1);
        newTasks.splice(targetIndex, 0, draggedItem);

        // Update local state immediately for better UX
        setTasks(newTasks);

        // Send new order to server
        const newOrder = newTasks.map(task => task.id);
        saveNewOrder(newOrder);
    };

    return (
        <div class="container mt-5">
            <style>
                {`
          .dragging {
            opacity: 0.5;
          }
          .drag-over {
            border: 2px dashed #007bff;
          }
        `}
            </style>
            <h1 class="mb-4">Todo List</h1>

            {/* Add Task Form */}
            <form onSubmit={addTask} class="row g-3 mb-4">
                <div class="col-md-6">
                    <input
                        type="text"
                        class="form-control"
                        placeholder="Enter new task"
                        value={taskInput()}
                        onInput={(e) => setTaskInput(e.target.value)}
                        required
                    />
                </div>
                <div class="col-md-4">
                    <input
                        type="datetime-local"
                        class="form-control"
                        value={completionDate()}
                        onInput={(e) => setCompletionDate(e.target.value)}
                    />
                </div>
                <div class="col-md-2">
                    <button type="submit" class="btn btn-primary w-100">Add Task</button>
                </div>
            </form>

            {/* Task List */}
            <ul class="list-group">
                <For each={tasks()}>
                    {(task) => (
                        <li
                            class={`list-group-item d-flex justify-content-between align-items-center ${draggedTask() === task.id ? 'dragging' : ''}`}
                            draggable={editingTask() !== task.id}
                            onDragStart={() => handleDragStart(task.id)}
                            onDragEnd={handleDragEnd}
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, task.id)}
                            style="cursor: move;"
                        >
                            {editingTask() === task.id ? (
                                <form onSubmit={saveEdit} class="d-flex w-100 align-items-center">
                                    <input
                                        type="text"
                                        class="form-control me-2"
                                        value={editTaskName()}
                                        onInput={(e) => setEditTaskName(e.target.value)}
                                    />
                                    <input
                                        type="datetime-local"
                                        class="form-control me-2"
                                        value={editCompletionDate()}
                                        onInput={(e) => setEditCompletionDate(e.target.value)}
                                    />
                                    <button type="submit" class="btn btn-sm btn-primary me-2">Save</button>
                                    <button type="button" class="btn btn-sm btn-secondary" onClick={cancelEdit}>
                                        Cancel
                                    </button>
                                </form>
                            ) : (
                                <>
                                    <div class="flex-grow-1">
                                        <span class={task.completed ? 'text-decoration-line-through' : ''}>
                                            {task.task} (Due: {new Date(task.completionDate).toLocaleString()})
                                        </span>
                                    </div>
                                    <div>
                                        <button
                                            class="btn btn-sm btn-success me-2"
                                            onClick={() => toggleComplete(task)}
                                        >
                                            {task.completed ? 'Undo' : 'Complete'}
                                        </button>
                                        <button
                                            class="btn btn-sm btn-warning me-2"
                                            onClick={() => startEdit(task)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            class="btn btn-sm btn-danger"
                                            onClick={() => deleteTask(task.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    )}
                </For>
            </ul>
        </div>
    );
};

export default TodoList;
