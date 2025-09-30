import { LitElement, html, css } from 'lit';

class TodoListApp extends LitElement {
    static properties = {
        tasks: { type: Array },
        taskInput: { type: String },
        completionDate: { type: String },
        editingTask: { type: Number },
        editTaskName: { type: String },
        editDate: { type: String },
        draggedItem: { type: Object }
    };

    // Disable Shadow DOM to allow Bootstrap styles
    createRenderRoot() {
        return this;
    }

    constructor() {
        super();
        this.tasks = [];
        this.taskInput = '';
        this.completionDate = '';
        this.editingTask = null;
        this.editTaskName = '';
        this.editDate = '';
        this.draggedItem = null;
        this.API_URL = 'http://localhost:3000/tasks';
    }

    connectedCallback() {
        super.connectedCallback();
        this._fetchTasks();
    }

    async _fetchTasks() {
        try {
            const response = await fetch(this.API_URL);
            this.tasks = await response.json();
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    async _addTask(e) {
        e.preventDefault();
        if (!this.taskInput.trim()) return;

        const newTask = {
            task: this.taskInput.trim(),
            completed: false,
            completionDate: this.completionDate || new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString()
        };

        try {
            await fetch(this.API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTask)
            });
            this.taskInput = '';
            this.completionDate = '';
            this._fetchTasks();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    async _toggleComplete(task) {
        try {
            await fetch(`${this.API_URL}/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !task.completed })
            });
            this._fetchTasks();
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    }

    async _deleteTask(taskId) {
        try {
            await fetch(`${this.API_URL}/${taskId}`, {
                method: 'DELETE'
            });
            this._fetchTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }

    _startEdit(task) {
        this.editingTask = task.id;
        this.editTaskName = task.task;
        this.editDate = new Date(task.completionDate).toISOString().slice(0, 16);
    }

    async _saveEdit(e) {
        e.preventDefault();
        if (this.editingTask === null) return;

        try {
            await fetch(`${this.API_URL}/${this.editingTask}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    task: this.editTaskName,
                    completionDate: this.editDate
                })
            });
            this.editingTask = null;
            this._fetchTasks();
        } catch (error) {
            console.error('Error editing task:', error);
        }
    }

    _cancelEdit() {
        this.editingTask = null;
    }

    _onDragStart(task) {
        this.draggedItem = task;
    }

    _onDragOver(e) {
        e.preventDefault();
    }

    async _onDrop(dropIndex) {
        if (!this.draggedItem) return;

        const dragIndex = this.tasks.findIndex(task => task.id === this.draggedItem.id);
        if (dragIndex === dropIndex) return;

        const newTasks = [...this.tasks];
        const [draggedTask] = newTasks.splice(dragIndex, 1);
        newTasks.splice(dropIndex, 0, draggedTask);

        const newOrder = newTasks.map(task => task.id);
        this.tasks = newTasks;

        try {
            await fetch(`${this.API_URL}/reorder`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order: newOrder })
            });
            this._fetchTasks();
        } catch (error) {
            console.error('Error reordering tasks:', error);
        }

        this.draggedItem = null;
    }

    _formatDate(date) {
        return new Date(date).toLocaleString();
    }

    _handleTaskInput(e) {
        this.taskInput = e.target.value;
    }

    _handleDateInput(e) {
        this.completionDate = e.target.value;
    }

    _handleEditTaskInput(e) {
        this.editTaskName = e.target.value;
    }

    _handleEditDateInput(e) {
        this.editDate = e.target.value;
    }

    render() {
        return html`
      <style>
        .dragging {
          opacity: 0.5;
        }
      </style>
      <div class="container mt-5">
        <h1 class="mb-4">Todo List</h1>

        <!-- Add Task Form -->
        <form @submit=${this._addTask} class="row g-3 mb-4">
          <div class="col-md-6">
            <input
              type="text"
              class="form-control"
              placeholder="Enter new task"
              .value=${this.taskInput}
              @input=${this._handleTaskInput}
              required
            />
          </div>
          <div class="col-md-4">
            <input
              type="datetime-local"
              class="form-control"
              .value=${this.completionDate}
              @input=${this._handleDateInput}
            />
          </div>
          <div class="col-md-2">
            <button type="submit" class="btn btn-primary w-100">
              Add Task
            </button>
          </div>
        </form>

        <!-- Task List -->
        <ul class="list-group">
          ${this.tasks.map((task, index) => html`
            <li
              class="list-group-item d-flex justify-content-between align-items-center ${this.draggedItem && this.draggedItem.id === task.id ? 'dragging' : ''
            }"
              draggable="true"
              @dragstart=${() => this._onDragStart(task)}
              @dragover=${this._onDragOver}
              @drop=${() => this._onDrop(index)}
            >
              ${this.editingTask === task.id ? html`
                <!-- Edit Mode -->
                <form @submit=${this._saveEdit} class="d-flex w-100 align-items-center">
                  <input
                    type="text"
                    class="form-control me-2"
                    .value=${this.editTaskName}
                    @input=${this._handleEditTaskInput}
                    required
                  />
                  <input
                    type="datetime-local"
                    class="form-control me-2"
                    .value=${this.editDate}
                    @input=${this._handleEditDateInput}
                  />
                  <button type="submit" class="btn btn-sm btn-primary me-2">
                    Save
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-secondary"
                    @click=${this._cancelEdit}
                  >
                    Cancel
                  </button>
                </form>
              ` : html`
                <!-- View Mode -->
                <div class="d-flex w-100 justify-content-between align-items-center">
                  <div class="flex-grow-1">
                    <span class=${task.completed ? 'text-decoration-line-through' : ''}>
                      ${task.task} (Due: ${this._formatDate(task.completionDate)})
                    </span>
                  </div>
                  <div>
                    <button
                      class="btn btn-sm btn-success me-2"
                      @click=${() => this._toggleComplete(task)}
                    >
                      ${task.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button
                      class="btn btn-sm btn-warning me-2"
                      @click=${() => this._startEdit(task)}
                    >
                      Edit
                    </button>
                    <button
                      class="btn btn-sm btn-danger"
                      @click=${() => this._deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              `}
            </li>
          `)}
        </ul>
      </div>
    `;
    }
}

customElements.define('todo-list-app', TodoListApp);
