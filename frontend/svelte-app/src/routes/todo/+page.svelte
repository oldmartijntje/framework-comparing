<script lang="ts">
	import { onMount } from 'svelte';
	import { todoService, type Task } from '$lib/services/todoService';

	let tasks: Task[] = [];
	let taskInput: string = '';
	let completionDate: string = '';
	let editingTask: number | null = null;
	let editTaskName: string = '';
	let editDate: string = '';
	let draggedItem: Task | null = null;

	onMount(async () => {
		await fetchTasks();
	});

	async function fetchTasks(): Promise<void> {
		try {
			tasks = await todoService.getTasks();
		} catch (error) {
			console.error('Error fetching tasks:', error);
		}
	}

	async function addTask(): Promise<void> {
		if (!taskInput.trim()) return;

		const newTask = {
			task: taskInput.trim(),
			completed: false,
			completionDate: completionDate || new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString()
		};

		try {
			await todoService.addTask(newTask);
			taskInput = '';
			completionDate = '';
			await fetchTasks();
		} catch (error) {
			console.error('Error adding task:', error);
		}
	}

	async function toggleComplete(task: Task): Promise<void> {
		try {
			await todoService.updateTask(task.id, { completed: !task.completed });
			await fetchTasks();
		} catch (error) {
			console.error('Error toggling task:', error);
		}
	}

	async function deleteTask(taskId: number): Promise<void> {
		try {
			await todoService.deleteTask(taskId);
			await fetchTasks();
		} catch (error) {
			console.error('Error deleting task:', error);
		}
	}

	function startEdit(task: Task): void {
		editingTask = task.id;
		editTaskName = task.task;
		editDate = new Date(task.completionDate).toISOString().slice(0, 16);
	}

	async function saveEdit(): Promise<void> {
		if (editingTask === null) return;

		try {
			await todoService.updateTask(editingTask, {
				task: editTaskName,
				completionDate: editDate
			});
			editingTask = null;
			await fetchTasks();
		} catch (error) {
			console.error('Error editing task:', error);
		}
	}

	function cancelEdit(): void {
		editingTask = null;
	}

	function onDragStart(task: Task): void {
		draggedItem = task;
	}

	function onDragOver(event: DragEvent): void {
		event.preventDefault();
	}

	async function onDrop(dropIndex: number): Promise<void> {
		if (!draggedItem) return;

		const dragIndex = tasks.findIndex(task => task.id === draggedItem!.id);
		if (dragIndex === dropIndex) return;

		const newTasks = [...tasks];
		const [draggedTask] = newTasks.splice(dragIndex, 1);
		newTasks.splice(dropIndex, 0, draggedTask);

		const newOrder = newTasks.map(task => task.id);
		tasks = newTasks;
		
		try {
			await todoService.reorderTasks(newOrder);
			await fetchTasks();
		} catch (error) {
			console.error('Error reordering tasks:', error);
		}
		
		draggedItem = null;
	}

	function formatDate(date: string | Date): string {
		return new Date(date).toLocaleString();
	}
</script>

<svelte:head>
	<title>Todo List - Svelte App</title>
</svelte:head>

<div class="container mt-5">
	<h1 class="mb-4">Todo List</h1>

	<!-- Add Task Form -->
	<form on:submit|preventDefault={addTask} class="row g-3 mb-4">
		<div class="col-md-6">
			<input
				type="text"
				class="form-control"
				placeholder="Enter new task"
				bind:value={taskInput}
				required
			/>
		</div>
		<div class="col-md-4">
			<input
				type="datetime-local"
				class="form-control"
				bind:value={completionDate}
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
		{#each tasks as task, index (task.id)}
			<li
				class="list-group-item d-flex justify-content-between align-items-center"
				class:dragging={draggedItem && draggedItem.id === task.id}
				draggable="true"
				on:dragstart={() => onDragStart(task)}
				on:dragover={onDragOver}
				on:drop={() => onDrop(index)}
				role="listitem"
			>
				{#if editingTask === task.id}
					<form 
						on:submit|preventDefault={saveEdit}
						class="d-flex w-100 align-items-center"
					>
						<input
							type="text"
							class="form-control me-2"
							bind:value={editTaskName}
							required
						/>
						<input
							type="datetime-local"
							class="form-control me-2"
							bind:value={editDate}
						/>
						<button type="submit" class="btn btn-sm btn-primary me-2">
							Save
						</button>
						<button type="button" class="btn btn-sm btn-secondary" on:click={cancelEdit}>
							Cancel
						</button>
					</form>
				{:else}
					<div class="flex-grow-1">
						<span class:text-decoration-line-through={task.completed}>
							{task.task} (Due: {formatDate(task.completionDate)})
						</span>
					</div>
					<div>
						<button
							class="btn btn-sm btn-success me-2"
							on:click={() => toggleComplete(task)}
						>
							{task.completed ? 'Undo' : 'Complete'}
						</button>
						<button
							class="btn btn-sm btn-warning me-2"
							on:click={() => startEdit(task)}
						>
							Edit
						</button>
						<button
							class="btn btn-sm btn-danger"
							on:click={() => deleteTask(task.id)}
						>
							Delete
						</button>
					</div>
				{/if}
			</li>
		{/each}
	</ul>
</div>

<style>
	.dragging {
		opacity: 0.5;
	}
</style>
