<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import 'bootstrap/dist/css/bootstrap.min.css';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Framework Comparison - Svelte App</title>
</svelte:head>

<Navbar />

{@render children()}

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
