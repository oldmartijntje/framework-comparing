import { LitElement, html, css } from 'lit';

class NavBar extends LitElement {
    static properties = {
        currentPage: { type: String }
    };

    // Disable Shadow DOM to allow Bootstrap styles
    createRenderRoot() {
        return this;
    }

    constructor() {
        super();
        this.currentPage = 'tic-tac-toe';
    }

    _handleNavClick(page, e) {
        e.preventDefault();
        this.dispatchEvent(new CustomEvent('page-changed', {
            detail: { page },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        return html`
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a 
            class="navbar-brand" 
            href="#"
            @click=${(e) => this._handleNavClick('tic-tac-toe', e)}
          >
            Lit - Tic-Tac-Toe
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
                  class="nav-link ${this.currentPage === 'tic-tac-toe' ? 'active' : ''}"
                  href="#"
                  @click=${(e) => this._handleNavClick('tic-tac-toe', e)}
                >
                  Tic Tac Toe
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link ${this.currentPage === 'todo' ? 'active' : ''}"
                  href="#"
                  @click=${(e) => this._handleNavClick('todo', e)}
                >
                  Todo List
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    `;
    }
}

customElements.define('nav-bar', NavBar);
