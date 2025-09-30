import { useState } from 'preact/hooks';

function TicTacToe() {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState('X');

    const checkWinner = (squares) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];

        for (let [a, b, c] of lines) {
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const handleClick = (i) => {
        if (board[i] || checkWinner(board)) return;

        const newBoard = board.slice();
        newBoard[i] = currentPlayer;
        setBoard(newBoard);

        const winner = checkWinner(newBoard);
        if (!winner && !newBoard.includes(null)) {
            // It's a draw - don't change player
            return;
        }

        if (!winner) {
            setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setCurrentPlayer('X');
    };

    const renderSquare = (i) => (
        <button
            className="btn btn-outline-dark cell"
            onClick={() => handleClick(i)}
        >
            {board[i]}
        </button>
    );

    const winner = checkWinner(board);
    const isDraw = !winner && !board.includes(null);

    let status;
    if (winner) {
        status = `${winner} wins!`;
    } else if (isDraw) {
        status = "It's a draw!";
    } else {
        status = `Player ${currentPlayer}'s turn`;
    }

    return (
        <div className="container text-center mt-5">
            <h1 className="mb-4">Tic-Tac-Toe</h1>
            <div className="d-grid game-board mx-auto">
                {Array(9).fill(null).map((_, i) => renderSquare(i))}
            </div>
            <p className="mt-3 fs-5">{status}</p>
            <button className="btn btn-primary mt-3" onClick={resetGame}>
                Reset Game
            </button>

            <style jsx>{`
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
      `}</style>
        </div>
    );
}

export default TicTacToe;
