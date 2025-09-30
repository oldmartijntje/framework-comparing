<script lang="ts">
	let board: (string | null)[] = Array(9).fill(null);
	let currentPlayer: string = 'X';
	let status: string = "Player X's turn";

	function checkWinner(): string | null {
		const lines = [
			[0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
			[0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
			[0, 4, 8], [2, 4, 6] // diagonals
		];
		
		for (let [a, b, c] of lines) {
			if (board[a] && board[a] === board[b] && board[a] === board[c]) {
				return board[a];
			}
		}
		return null;
	}

	function handleClick(i: number): void {
		if (board[i] || checkWinner()) return;
		
		board[i] = currentPlayer;
		
		const winner = checkWinner();
		if (winner) {
			status = `${winner} wins!`;
		} else if (!board.includes(null)) {
			status = "It's a draw!";
		} else {
			currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
			status = `Player ${currentPlayer}'s turn`;
		}
	}

	function resetGame(): void {
		board = Array(9).fill(null);
		currentPlayer = 'X';
		status = "Player X's turn";
	}
</script>

<svelte:head>
	<title>Tic-Tac-Toe - Svelte App</title>
</svelte:head>

<div class="container text-center mt-5">
	<h1 class="mb-4">Tic-Tac-Toe</h1>
	<div class="game-board d-grid mx-auto">
		{#each board as cell, index}
			<button
				class="btn btn-outline-dark cell"
				on:click={() => handleClick(index)}
			>
				{cell || ''}
			</button>
		{/each}
	</div>
	<p class="mt-3 fs-5">{status}</p>
	<button class="btn btn-primary mt-3" on:click={resetGame}>
		Reset Game
	</button>
</div>

<style>
	.game-board {
		grid-template-columns: repeat(3, 100px);
		grid-gap: 10px;
		width: 320px;
	}

	.cell {
		width: 100px;
		height: 100px;
		font-size: 2rem;
	}
</style>
