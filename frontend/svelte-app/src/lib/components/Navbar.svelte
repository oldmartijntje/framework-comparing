<script lang="ts">
	import { page } from '$app/stores';
	
	// Reactive statement to determine active page
	$: currentPath = $page.url.pathname;
</script>

<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
	<div class="container-fluid">
		<a class="navbar-brand" href="/tic-tac-toe">
			Svelte - Tic-Tac-Toe
		</a>
		<button 
			class="navbar-toggler" 
			type="button" 
			data-bs-toggle="collapse" 
			data-bs-target="#navbarNav"
		>
			<span class="navbar-toggler-icon"></span>
		</button>
		<div class="collapse navbar-collapse" id="navbarNav">
			<ul class="navbar-nav ms-auto">
				<li class="nav-item">
					<a 
						class="nav-link" 
						class:active={currentPath === '/' || currentPath === '/tic-tac-toe'}
						href="/tic-tac-toe"
					>
						Tic Tac Toe
					</a>
				</li>
				<li class="nav-item">
					<a 
						class="nav-link" 
						class:active={currentPath === '/todo'}
						href="/todo"
					>
						Todo List
					</a>
				</li>
			</ul>
		</div>
	</div>
</nav>

<style>
	/* Component-specific styles can go here if needed */
</style>
