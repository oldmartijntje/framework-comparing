import React, { useState, useEffect } from 'react';

function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState('');
    const [completionDate, setCompletionDate] = useState('');
    const [editingTask, setEditingTask] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);

    const API_URL = "http://localhost:3000/tasks";

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch(API_URL);
            const tasksData = await response.json();
            setTasks(tasksData);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!taskInput.trim()) return;

        const newTask = {
            task: taskInput.trim(),
            completed: false,
            completionDate: completionDate || new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString()
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

    const toggleComplete = async (taskId, completed) => {
        try {
            await fetch(`${API_URL}/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !completed })
            });
            fetchTasks();
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await fetch(`${API_URL}/${taskId}`, {
                method: 'DELETE'
            });
            fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const editTask = async (taskId, newTaskName, newCompletionDate) => {
        try {
            await fetch(`${API_URL}/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    task: newTaskName,
                    completionDate: newCompletionDate
                })
            });
            setEditingTask(null);
            fetchTasks();
        } catch (error) {
            console.error('Error editing task:', error);
        }
    };

    const saveNewOrder = async (newOrder) => {
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

    const handleDragStart = (e, task) => {
        setDraggedItem(task);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (!draggedItem) return;

        const dragIndex = tasks.findIndex(task => task.id === draggedItem.id);
        if (dragIndex === dropIndex) return;

        const newTasks = [...tasks];
        const [draggedTask] = newTasks.splice(dragIndex, 1);
        newTasks.splice(dropIndex, 0, draggedTask);

        const newOrder = newTasks.map(task => task.id);
        setTasks(newTasks);
        saveNewOrder(newOrder);
        setDraggedItem(null);
    };

    const EditForm = ({ task, onSave, onCancel }) => {
        const [editTaskName, setEditTaskName] = useState(task.task);
        const [editDate, setEditDate] = useState(
            new Date(task.completionDate).toISOString().slice(0, 16)
        );

        const handleSubmit = (e) => {
            e.preventDefault();
            onSave(task.id, editTaskName.trim(), editDate);
        };

        return (
            <form onSubmit={handleSubmit} className="d-flex w-100 align-items-center">
                <input
                    type="text"
                    className="form-control me-2"
                    value={editTaskName}
                    onChange={(e) => setEditTaskName(e.target.value)}
                    required
                />
                <input
                    type="datetime-local"
                    className="form-control me-2"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                />
                <button type="submit" className="btn btn-sm btn-primary me-2">
                    Save
                </button>
                <button type="button" className="btn btn-sm btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
            </form>
        );
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Todo List</h1>

            {/* Add Task Form */}
            <form onSubmit={addTask} className="row g-3 mb-4">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter new task"
                        value={taskInput}
                        onChange={(e) => setTaskInput(e.target.value)}
                        required
                    />
                </div>
                <div className="col-md-4">
                    <input
                        type="datetime-local"
                        className="form-control"
                        value={completionDate}
                        onChange={(e) => setCompletionDate(e.target.value)}
                    />
                </div>
                <div className="col-md-2">
                    <button type="submit" className="btn btn-primary w-100">
                        Add Task
                    </button>
                </div>
            </form>

            {/* Task List */}
            <ul className="list-group">
                {tasks.map((task, index) => (
                    <li
                        key={task.id}
                        className={`list-group-item d-flex justify-content-between align-items-center ${draggedItem && draggedItem.id === task.id ? 'opacity-50' : ''
                            }`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                    >
                        {editingTask === task.id ? (
                            <EditForm
                                task={task}
                                onSave={editTask}
                                onCancel={() => setEditingTask(null)}
                            />
                        ) : (
                            <>
                                <div className="flex-grow-1">
                                    <span
                                        className={task.completed ? 'text-decoration-line-through' : ''}
                                    >
                                        {task.task} (Due: {new Date(task.completionDate).toLocaleString()})
                                    </span>
                                </div>
                                <div>
                                    <button
                                        className="btn btn-sm btn-success me-2"
                                        onClick={() => toggleComplete(task.id, task.completed)}
                                    >
                                        {task.completed ? 'Undo' : 'Complete'}
                                    </button>
                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={() => setEditingTask(task.id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => deleteTask(task.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoList;
