<template>
  <div class="container mt-5">
    <h1 class="mb-4">Todo List</h1>

    <!-- Add Task Form -->
    <form @submit.prevent="addTask" class="row g-3 mb-4">
      <div class="col-md-6">
        <input
          type="text"
          class="form-control"
          placeholder="Enter new task"
          v-model="taskInput"
          required
        />
      </div>
      <div class="col-md-4">
        <input
          type="datetime-local"
          class="form-control"
          v-model="completionDate"
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
      <li
        v-for="(task, index) in tasks"
        :key="task.id"
        class="list-group-item d-flex justify-content-between align-items-center"
        :class="{ 'dragging': draggedItem && draggedItem.id === task.id }"
        draggable="true"
        @dragstart="onDragStart(task)"
        @dragover.prevent="onDragOver"
        @drop="onDrop(index)"
      >
        <form 
          v-if="editingTask === task.id"
          @submit.prevent="saveEdit"
          class="d-flex w-100 align-items-center"
        >
          <input
            type="text"
            class="form-control me-2"
            v-model="editTaskName"
            required
          />
          <input
            type="datetime-local"
            class="form-control me-2"
            v-model="editDate"
          />
          <button type="submit" class="btn btn-sm btn-primary me-2">
            Save
          </button>
          <button type="button" class="btn btn-sm btn-secondary" @click="cancelEdit">
            Cancel
          </button>
        </form>
        
        <template v-else>
          <div class="flex-grow-1">
            <span :class="{ 'text-decoration-line-through': task.completed }">
              {{ task.task }} (Due: {{ formatDate(task.completionDate) }})
            </span>
          </div>
          <div>
            <button
              class="btn btn-sm btn-success me-2"
              @click="toggleComplete(task)"
            >
              {{ task.completed ? 'Undo' : 'Complete' }}
            </button>
            <button
              class="btn btn-sm btn-warning me-2"
              @click="startEdit(task)"
            >
              Edit
            </button>
            <button
              class="btn btn-sm btn-danger"
              @click="deleteTask(task.id)"
            >
              Delete
            </button>
          </div>
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
import { todoService } from '../services/todoService'

export default {
  name: 'TodoList',
  data() {
    return {
      tasks: [],
      taskInput: '',
      completionDate: '',
      editingTask: null,
      editTaskName: '',
      editDate: '',
      draggedItem: null
    }
  },
  
  async mounted() {
    await this.fetchTasks()
  },
  
  methods: {
    async fetchTasks() {
      try {
        this.tasks = await todoService.getTasks()
      } catch (error) {
        console.error('Error fetching tasks:', error)
      }
    },
    
    async addTask() {
      if (!this.taskInput.trim()) return

      const newTask = {
        task: this.taskInput.trim(),
        completed: false,
        completionDate: this.completionDate || new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString()
      }

      try {
        await todoService.addTask(newTask)
        this.taskInput = ''
        this.completionDate = ''
        await this.fetchTasks()
      } catch (error) {
        console.error('Error adding task:', error)
      }
    },
    
    async toggleComplete(task) {
      try {
        await todoService.updateTask(task.id, { completed: !task.completed })
        await this.fetchTasks()
      } catch (error) {
        console.error('Error toggling task:', error)
      }
    },
    
    async deleteTask(taskId) {
      try {
        await todoService.deleteTask(taskId)
        await this.fetchTasks()
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    },
    
    startEdit(task) {
      this.editingTask = task.id
      this.editTaskName = task.task
      this.editDate = new Date(task.completionDate).toISOString().slice(0, 16)
    },
    
    async saveEdit() {
      if (this.editingTask === null) return

      try {
        await todoService.updateTask(this.editingTask, {
          task: this.editTaskName,
          completionDate: this.editDate
        })
        this.editingTask = null
        await this.fetchTasks()
      } catch (error) {
        console.error('Error editing task:', error)
      }
    },
    
    cancelEdit() {
      this.editingTask = null
    },
    
    onDragStart(task) {
      this.draggedItem = task
    },
    
    onDragOver() {
      // Just prevent default to allow drop
    },
    
    async onDrop(dropIndex) {
      if (!this.draggedItem) return

      const dragIndex = this.tasks.findIndex(task => task.id === this.draggedItem.id)
      if (dragIndex === dropIndex) return

      const newTasks = [...this.tasks]
      const [draggedTask] = newTasks.splice(dragIndex, 1)
      newTasks.splice(dropIndex, 0, draggedTask)

      const newOrder = newTasks.map(task => task.id)
      this.tasks = newTasks
      
      try {
        await todoService.reorderTasks(newOrder)
        await this.fetchTasks()
      } catch (error) {
        console.error('Error reordering tasks:', error)
      }
      
      this.draggedItem = null
    },
    
    formatDate(date) {
      return new Date(date).toLocaleString()
    }
  }
}
</script>

<style scoped>
.dragging {
  opacity: 0.5;
}
</style>
