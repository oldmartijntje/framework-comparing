import { useState, useEffect } from 'preact/hooks';

const API_URL = 'http://localhost:3000/tasks';

function TodoList() {
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState('');
    const [completionDate, setCompletionDate] = useState('');
    const [editingTask, setEditingTask] = useState(null);
    const [editTaskName, setEditTaskName] = useState('');
    const [editDate, setEditDate] = useState('');
    const [draggedItem, setDraggedItem] = useState(null);

    const fetchTasks = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

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

    const toggleComplete = async (task) => {
        try {
            await fetch(`${API_URL}/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !task.completed })
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

    const startEdit = (task) => {
        setEditingTask(task.id);
        setEditTaskName(task.task);
        setEditDate(new Date(task.completionDate).toISOString().slice(0, 16));
    };

    const saveEdit = async (e) => {
        e.preventDefault();
        if (editingTask === null) return;

        try {
            await fetch(`${API_URL}/${editingTask}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    task: editTaskName,
                    completionDate: editDate
                })
            });
            setEditingTask(null);
            fetchTasks();
        } catch (error) {
            console.error('Error editing task:', error);
        }
    };

    const cancelEdit = () => {
        setEditingTask(null);
    };

    const onDragStart = (task) => {
        setDraggedItem(task);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const onDrop = async (dropIndex) => {
        if (!draggedItem) return;

        const dragIndex = tasks.findIndex(task => task.id === draggedItem.id);
        if (dragIndex === dropIndex) return;

        const newTasks = [...tasks];
        const [draggedTask] = newTasks.splice(dragIndex, 1);
        newTasks.splice(dropIndex, 0, draggedTask);

        const newOrder = newTasks.map(task => task.id);
        setTasks(newTasks);

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

        setDraggedItem(null);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString();
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
                        onInput={(e) => setTaskInput(e.target.value)}
                        required
                    />
                </div>
                <div className="col-md-4">
                    <input
                        type="datetime-local"
                        className="form-control"
                        value={completionDate}
                        onInput={(e) => setCompletionDate(e.target.value)}
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
                        className={`list-group-item d-flex justify-content-between align-items-center ${draggedItem && draggedItem.id === task.id ? 'dragging' : ''
                            }`}
                        draggable="true"
                        onDragStart={() => onDragStart(task)}
                        onDragOver={onDragOver}
                        onDrop={() => onDrop(index)}
                    >
                        {editingTask === task.id ? (
                            // Edit Mode
                            <form onSubmit={saveEdit} className="d-flex w-100 align-items-center">
                                <input
                                    type="text"
                                    className="form-control me-2"
                                    value={editTaskName}
                                    onInput={(e) => setEditTaskName(e.target.value)}
                                    required
                                />
                                <input
                                    type="datetime-local"
                                    className="form-control me-2"
                                    value={editDate}
                                    onInput={(e) => setEditDate(e.target.value)}
                                />
                                <button type="submit" className="btn btn-sm btn-primary me-2">
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-secondary"
                                    onClick={cancelEdit}
                                >
                                    Cancel
                                </button>
                            </form>
                        ) : (
                            // View Mode
                            <div className="d-flex w-100 justify-content-between align-items-center">
                                <div className="flex-grow-1">
                                    <span
                                        className={task.completed ? 'text-decoration-line-through' : ''}
                                    >
                                        {task.task} (Due: {formatDate(task.completionDate)})
                                    </span>
                                </div>
                                <div>
                                    <button
                                        className="btn btn-sm btn-success me-2"
                                        onClick={() => toggleComplete(task)}
                                    >
                                        {task.completed ? 'Undo' : 'Complete'}
                                    </button>
                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={() => startEdit(task)}
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
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            <style jsx>{`
        .dragging {
          opacity: 0.5;
        }
      `}</style>
        </div>
    );
}

export default TodoList;
