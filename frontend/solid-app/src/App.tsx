import { Component, createSignal, onMount } from 'solid-js';
import Navbar from './components/Navbar';
import TicTacToe from './components/TicTacToe';
import TodoList from './components/TodoList';

const App: Component = () => {
    const getPageFromURL = () => {
        const path = window.location.pathname;
        if (path === '/todo' || path === '/todo.html') return 'todo';
        return 'tictactoe';
    };

    const [currentPage, setCurrentPage] = createSignal(getPageFromURL());

    const navigateToPage = (page: string) => {
        setCurrentPage(page);
        const url = page === 'todo' ? '/todo' : '/';
        window.history.pushState({}, '', url);
    };

    onMount(() => {
        // Handle browser back/forward navigation
        const handlePopState = () => {
            setCurrentPage(getPageFromURL());
        };

        window.addEventListener('popstate', handlePopState);

        // Cleanup function
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    });

    return (
        <div>
            <Navbar currentPage={currentPage()} setCurrentPage={navigateToPage} />
            {currentPage() === 'tictactoe' ? <TicTacToe /> : <TodoList />}
        </div>
    );
};

export default App;
