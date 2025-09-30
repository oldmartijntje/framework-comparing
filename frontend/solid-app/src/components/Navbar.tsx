import { Component } from 'solid-js';

interface NavbarProps {
    currentPage: string;
    setCurrentPage: (page: string) => void;
}

const Navbar: Component<NavbarProps> = (props) => {
    return (
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand" href="#" onClick={(e) => { e.preventDefault(); props.setCurrentPage('tictactoe'); }}>
                    Solid.js - Tic-Tac-Toe
                </a>
                <button
                    class="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <a
                                class={`nav-link ${props.currentPage === 'tictactoe' ? 'active' : ''}`}
                                href="#"
                                onClick={(e) => { e.preventDefault(); props.setCurrentPage('tictactoe'); }}
                            >
                                Tic Tac Toe
                            </a>
                        </li>
                        <li class="nav-item">
                            <a
                                class={`nav-link ${props.currentPage === 'todo' ? 'active' : ''}`}
                                href="#"
                                onClick={(e) => { e.preventDefault(); props.setCurrentPage('todo'); }}
                            >
                                Todo List
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
