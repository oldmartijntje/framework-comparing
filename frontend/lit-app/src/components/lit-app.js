import { LitElement, html, css } from 'lit';

class LitApp extends LitElement {
    static properties = {
        currentPage: { type: String }
    };

    // Disable Shadow DOM to allow Bootstrap styles
    createRenderRoot() {
        return this;
    }

    constructor() {
        super();
        this.currentPage = this._getPageFromURL();
    }

    connectedCallback() {
        super.connectedCallback();
        // Listen for browser back/forward button
        window.addEventListener('popstate', () => {
            this.currentPage = this._getPageFromURL();
        });

        // Set initial URL if needed
        if (window.location.pathname === '/') {
            const initialPath = this.currentPage === 'todo' ? '/todo' : '/tic-tac-toe';
            window.history.replaceState({}, '', initialPath);
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('popstate', () => {
            this.currentPage = this._getPageFromURL();
        });
    }

    _getPageFromURL() {
        const path = window.location.pathname;
        if (path === '/todo' || window.location.hash === '#todo') {
            return 'todo';
        }
        return 'tic-tac-toe';
    }

    _handlePageChange(e) {
        const newPage = e.detail.page;
        this.currentPage = newPage;

        // Update URL without page refresh
        const path = newPage === 'todo' ? '/todo' : '/tic-tac-toe';
        window.history.pushState({}, '', path);
    }

    render() {
        return html`
      <nav-bar 
        .currentPage=${this.currentPage} 
        @page-changed=${this._handlePageChange}>
      </nav-bar>
      
      ${this.currentPage === 'tic-tac-toe'
                ? html`<tic-tac-toe-game></tic-tac-toe-game>`
                : html`<todo-list-app></todo-list-app>`
            }
    `;
    }
}

customElements.define('lit-app', LitApp);
