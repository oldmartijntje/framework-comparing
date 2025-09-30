<template>
  <div class="container text-center mt-5">
    <h1 class="mb-4">Tic-Tac-Toe</h1>
    <div class="game-board d-grid mx-auto">
      <button
        v-for="(cell, index) in board"
        :key="index"
        class="btn btn-outline-dark cell"
        @click="handleClick(index)"
      >
        {{ cell || '' }}
      </button>
    </div>
    <p class="mt-3 fs-5">{{ status }}</p>
    <button class="btn btn-primary mt-3" @click="resetGame">
      Reset Game
    </button>
  </div>
</template>

<script>
export default {
  name: 'TicTacToe',
  data() {
    return {
      board: Array(9).fill(null),
      currentPlayer: 'X',
      status: "Player X's turn"
    }
  },
  methods: {
    checkWinner() {
      const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
      ]
      
      for (let [a, b, c] of lines) {
        if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
          return this.board[a]
        }
      }
      return null
    },
    
    handleClick(i) {
      if (this.board[i] || this.checkWinner()) return
      
      this.board[i] = this.currentPlayer
      
      const winner = this.checkWinner()
      if (winner) {
        this.status = `${winner} wins!`
      } else if (!this.board.includes(null)) {
        this.status = "It's a draw!"
      } else {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X'
        this.status = `Player ${this.currentPlayer}'s turn`
      }
    },
    
    resetGame() {
      this.board = Array(9).fill(null)
      this.currentPlayer = 'X'
      this.status = "Player X's turn"
    }
  }
}
</script>

<style scoped>
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
