import { h } from 'preact';

function Navbar({ currentPage, setCurrentPage }) {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <a
                    className="navbar-brand"
                    href="#"
                    onClick={() => setCurrentPage('tic-tac-toe')}
                >
                    Preact - Tic-Tac-Toe
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a
                                className={`nav-link ${currentPage === 'tic-tac-toe' ? 'active' : ''}`}
                                href="#"
                                onClick={() => setCurrentPage('tic-tac-toe')}
                            >
                                Tic Tac Toe
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                className={`nav-link ${currentPage === 'todo' ? 'active' : ''}`}
                                href="#"
                                onClick={() => setCurrentPage('todo')}
                            >
                                Todo List
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
