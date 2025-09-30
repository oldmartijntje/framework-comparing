import { Component } from '@angular/core';

@Component({
    selector: 'app-tic-tac-toe',
    standalone: false,
    templateUrl: './tic-tac-toe.html',
    styleUrl: './tic-tac-toe.css'
})
export class TicTacToe {
    board: (string | null)[] = Array(9).fill(null);
    currentPlayer: string = 'X';
    status: string = "Player X's turn";

    checkWinner(): string | null {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];

        for (let [a, b, c] of lines) {
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                return this.board[a];
            }
        }
        return null;
    }

    handleClick(i: number): void {
        if (this.board[i] || this.checkWinner()) return;

        this.board[i] = this.currentPlayer;

        const winner = this.checkWinner();
        if (winner) {
            this.status = `${winner} wins!`;
        } else if (!this.board.includes(null)) {
            this.status = "It's a draw!";
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.status = `Player ${this.currentPlayer}'s turn`;
        }
    }

    resetGame(): void {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.status = "Player X's turn";
    }
}
