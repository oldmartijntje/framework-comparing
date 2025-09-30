import React, { useState } from 'react';

function TicTacToe() {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [status, setStatus] = useState("Player X's turn");

    const checkWinner = (board) => {
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
    };

    const handleClick = (i) => {
        if (board[i] || checkWinner(board)) return;

        const newBoard = [...board];
        newBoard[i] = currentPlayer;
        setBoard(newBoard);

        const winner = checkWinner(newBoard);
        if (winner) {
            setStatus(`${winner} wins!`);
        } else if (!newBoard.includes(null)) {
            setStatus("It's a draw!");
        } else {
            const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
            setCurrentPlayer(nextPlayer);
            setStatus(`Player ${nextPlayer}'s turn`);
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setCurrentPlayer('X');
        setStatus("Player X's turn");
    };

    const gameStyles = {
        gameBoard: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 100px)',
            gridGap: '10px',
            margin: '0 auto',
            width: '320px'
        },
        cell: {
            width: '100px',
            height: '100px',
            fontSize: '2rem'
        }
    };

    return (
        <div className="container text-center mt-5">
            <h1 className="mb-4">Tic-Tac-Toe</h1>
            <div style={gameStyles.gameBoard}>
                {board.map((cell, i) => (
                    <button
                        key={i}
                        className="btn btn-outline-dark"
                        style={gameStyles.cell}
                        onClick={() => handleClick(i)}
                    >
                        {cell || ""}
                    </button>
                ))}
            </div>
            <p className="mt-3 fs-5">{status}</p>
            <button className="btn btn-primary mt-3" onClick={resetGame}>
                Reset Game
            </button>
        </div>
    );
}

export default TicTacToe;
