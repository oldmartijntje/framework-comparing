import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './App.css'
import Navbar from './components/Navbar'
import TicTacToe from './components/TicTacToe'
import TodoList from './components/TodoList'

function App() {
    const [currentPage, setCurrentPage] = useState('tic-tac-toe')

    return (
        <>
            <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
            {currentPage === 'tic-tac-toe' ? <TicTacToe /> : <TodoList />}
        </>
    )
}

export default App
