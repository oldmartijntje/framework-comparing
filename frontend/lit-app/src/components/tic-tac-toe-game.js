import { LitElement, html, css } from 'lit';

class TicTacToeGame extends LitElement {
    static properties = {
        board: { type: Array },
        currentPlayer: { type: String },
        winner: { type: String },
        isDraw: { type: Boolean }
    };

    // Disable Shadow DOM to allow Bootstrap styles
    createRenderRoot() {
        return this;
    }

    constructor() {
        super();
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.winner = null;
        this.isDraw = false;
    }

    _checkWinner(board) {
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

    _handleCellClick(index) {
        if (this.board[index] || this.winner) return;

        const newBoard = [...this.board];
        newBoard[index] = this.currentPlayer;

        const winner = this._checkWinner(newBoard);
        const isDraw = !winner && !newBoard.includes(null);

        this.board = newBoard;
        this.winner = winner;
        this.isDraw = isDraw;

        if (!winner && !isDraw) {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        }
    }

    _resetGame() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.winner = null;
        this.isDraw = false;
    }

    _getStatus() {
        if (this.winner) return `${this.winner} wins!`;
        if (this.isDraw) return "It's a draw!";
        return `Player ${this.currentPlayer}'s turn`;
    }

    render() {
        return html`
      <style>
        .game-board {
          display: grid;
          grid-template-columns: repeat(3, 100px);
          grid-gap: 10px;
          width: 320px;
          margin: 0 auto;
        }
        
        .cell {
          width: 100px;
          height: 100px;
          font-size: 2rem;
        }
      </style>
      <div class="container text-center mt-5">
        <h1 class="mb-4">Tic-Tac-Toe</h1>
        <div class="game-board">
          ${this.board.map((cell, i) => html`
            <button
              class="btn btn-outline-dark cell"
              @click=${() => this._handleCellClick(i)}
              ?disabled=${cell || this.winner}
            >
              ${cell || ''}
            </button>
          `)}
        </div>
        <p class="mt-3 fs-5">${this._getStatus()}</p>
        <button class="btn btn-primary mt-3" @click=${this._resetGame}>
          Reset Game
        </button>
      </div>
    `;
    }
}

customElements.define('tic-tac-toe-game', TicTacToeGame);
