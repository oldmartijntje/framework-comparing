import { useState } from 'preact/hooks';
import Navbar from './components/Navbar.jsx';
import TicTacToe from './components/TicTacToe.jsx';
import TodoList from './components/TodoList.jsx';

function App() {
    const [currentPage, setCurrentPage] = useState('tic-tac-toe');

    return (
        <div>
            <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
            {currentPage === 'tic-tac-toe' ? (
                <TicTacToe />
            ) : (
                <TodoList />
            )}
        </div>
    );
}

export default App;
