const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// In-memory storage for tasks
let tasks = [
    {
        "id": 0,
        "task": "write api",
        "completed": true,
        "completionDate": new Date(new Date().getTime() + 1 * 60 * 60 * 1000)
    },
    {
        "id": 1,
        "task": "write react application",
        "completed": false,
        "completionDate": new Date(new Date().getTime() + 5 * 60 * 60 * 1000)
    },
    {
        "id": 2,
        "task": "write angular application",
        "completed": false,
        "completionDate": new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
    }
];
let nextId = 3;

// Helper function to find task by ID
const findTaskById = (id) => {
  return tasks.find(task => task.id === parseInt(id));
};

// GET /tasks - Get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// GET /tasks/:id - Get a single task by ID
app.get('/tasks/:id', (req, res) => {
  const task = findTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// POST /tasks - Create a new task
app.post('/tasks', (req, res) => {
  const { task, completionDate, completed } = req.body;
  
  if (!task || typeof task !== 'string') {
    return res.status(400).json({ error: 'Task description is required and must be a string' });
  }

  const newTask = {
    id: nextId++,
    task: task,
    completed: completed || false,
    completionDate: completionDate || new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id - Update a task
app.put('/tasks/:id', (req, res) => {
  const task = findTaskById(req.params.id);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { task: taskDescription, completionDate, completed } = req.body;

  if (taskDescription !== undefined) {
    if (typeof taskDescription !== 'string') {
      return res.status(400).json({ error: 'Task description must be a string' });
    }
    task.task = taskDescription;
  }

  if (completed !== undefined) {
    task.completed = completed;
  }

  if (completionDate !== undefined) {
    task.completionDate = completionDate;
  }

  res.json(task);
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(task => task.id === parseInt(req.params.id));
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];
  res.json(deletedTask);
});

// PATCH /tasks/reorder - Reorder tasks
app.patch('/tasks/reorder', (req, res) => {
  const { order } = req.body;

  if (!Array.isArray(order)) {
    return res.status(400).json({ error: 'Order must be an array of task IDs' });
  }

  // Verify all IDs exist
  const allIdsExist = order.every(id => findTaskById(id));
  if (!allIdsExist) {
    return res.status(400).json({ error: 'One or more task IDs not found' });
  }

  // Verify all tasks are accounted for
  if (order.length !== tasks.length) {
    return res.status(400).json({ error: 'Order array must contain all task IDs' });
  }

  // Create a map of current tasks
  const taskMap = new Map(tasks.map(task => [task.id, task]));

  // Reorder tasks based on the provided order
  tasks = order.map(id => taskMap.get(parseInt(id)));

  res.json(tasks);
});

// Start the server
app.listen(PORT, () => {
  console.log(`TODO API server is running on http://localhost:${PORT}`);
});
