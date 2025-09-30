import { Component, createSignal } from 'solid-js';

const TicTacToe: Component = () => {
    const [board, setBoard] = createSignal(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = createSignal('X');
    const [status, setStatus] = createSignal("Player X's turn");

    const checkWinner = (squares: (string | null)[]) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let [a, b, c] of lines) {
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const handleClick = (i: number) => {
        const squares = board().slice();
        if (squares[i] || checkWinner(squares)) return;

        squares[i] = currentPlayer();
        setBoard(squares);

        const winner = checkWinner(squares);
        if (winner) {
            setStatus(`${winner} wins!`);
        } else if (!squares.includes(null)) {
            setStatus("It's a draw!");
        } else {
            const nextPlayer = currentPlayer() === 'X' ? 'O' : 'X';
            setCurrentPlayer(nextPlayer);
            setStatus(`Player ${nextPlayer}'s turn`);
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setCurrentPlayer('X');
        setStatus("Player X's turn");
    };

    const renderSquare = (i: number) => (
        <button
            class="btn btn-outline-dark cell"
            style="width: 100px; height: 100px; font-size: 2rem;"
            onClick={() => handleClick(i)}
        >
            {board()[i] || ''}
        </button>
    );

    return (
        <div class="container text-center mt-5">
            <h1 class="mb-4">Tic-Tac-Toe</h1>
            <div
                class="d-grid mx-auto"
                style="grid-template-columns: repeat(3, 100px); grid-gap: 10px; width: 320px;"
            >
                {Array.from({ length: 9 }, (_, i) => renderSquare(i))}
            </div>
            <p class="mt-3 fs-5">{status()}</p>
            <button class="btn btn-primary mt-3" onClick={resetGame}>
                Reset Game
            </button>
        </div>
    );
};

export default TicTacToe;
