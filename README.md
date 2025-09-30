# Framework Comparison: Tic-Tac-Toe & Todo Apps

This repository showcases the same tic-tac-toe game and todo list application implemented across **12 different web frameworks and technologies**. Each implementation provides identical functionality while demonstrating the unique patterns, advantages, and approaches of each technology.

## 🎯 What's Included

Each implementation features:
- **Tic-Tac-Toe Game**: Complete game logic, win detection, and reset functionality
- **Todo List**: CRUD operations (Create, Read, Update, Delete)
- **Drag & Drop**: Reorderable todo items with server persistence
- **Responsive Design**: Bootstrap-styled UI (except Flutter which uses Material Design)
- **API Integration**: RESTful API communication with shared Node.js backend
- **URL Routing**: Page navigation that persists on refresh

## 🚀 Quick Start Guide

### Prerequisites
Before running any application, you'll need:
- **Node.js** (v18 or later) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/oldmartijntje/framework-comparing.git
cd framework-comparing
```

### 2. Start the API Server (Required for ALL apps!)
**⚠️ IMPORTANT: The API must be running for the todo functionality to work in any app!**

```bash
cd api
npm install
npm start
```

The API server will run on **http://localhost:3000**

Keep this terminal window open while testing the apps!

---

## 📋 Framework Implementations

### 1. Vanilla HTML/JavaScript 🍦
**Port**: 5174  
**Location**: `frontend/plain/`

**How to run:**
```bash
cd frontend/plain
npm install
npm run dev
# Visit: http://localhost:5174
```

**Alternative (no build process):**
```bash
# Direct file opening
cd frontend/plain/public
# Open index.html in your browser
```

**Features**: Pure HTML, CSS, and vanilla JavaScript served via Vite development server.

---

### 2. React ⚛️
**Port**: 5173  
**Location**: `frontend/react/my-react-app/`

**How to run:**
```bash
cd frontend/react/my-react-app
npm install
npm run dev
# Visit: http://localhost:5173
```

**Features**: Functional components, React hooks, Vite build tool.

---

### 3. Angular 🅰️
**Port**: 4200  
**Location**: `frontend/angular/angular-tictactoe-todo/`

**How to run:**
```bash
cd frontend/angular/angular-tictactoe-todo
npm install
npm start
# Visit: http://localhost:4200
```

**Features**: TypeScript, dependency injection, Angular CLI, routing module.

---

### 4. Vue.js 💚
**Port**: 8080  
**Location**: `frontend/vue-app/`

**How to run:**
```bash
cd frontend/vue-app
npm install
npm run serve
# Visit: http://localhost:8080
```

**Features**: Single File Components, Vue Router, Options API.

---

### 5. Svelte 🧡
**Port**: 3001  
**Location**: `frontend/svelte-app/`

**How to run:**
```bash
cd frontend/svelte-app
npm install
npm run dev
# Visit: http://localhost:3001
```

**Features**: Compile-time optimization, SvelteKit, file-based routing.

---

### 6. Alpine.js 🏔️
**Port**: 3002  
**Location**: `frontend/alpine-app/`

**How to run:**
```bash
cd frontend/alpine-app
npm install
npm run dev
# Visit: http://localhost:3002
```

**Features**: Lightweight reactivity, HTML-first approach, Alpine directives.

---

### 7. HTMX 🌐
**Port**: 3004  
**Location**: `frontend/htmx-app/`

**How to run:**
```bash
cd frontend/htmx-app
npm install
npm run dev
# Visit: http://localhost:3004
```

**Features**: Hypermedia-driven applications, server-side thinking, minimal JavaScript.

---

### 8. Preact ⚛️
**Port**: 3005  
**Location**: `frontend/preact-app/`

**How to run:**
```bash
cd frontend/preact-app
npm install
npm run dev
# Visit: http://localhost:3005
```

**Features**: Lightweight React alternative, smaller bundle size, React compatibility.

---

### 9. Lit 💡
**Port**: 3006  
**Location**: `frontend/lit-app/`

**How to run:**
```bash
cd frontend/lit-app
npm install
npm run dev
# Visit: http://localhost:3006
```

**Features**: Web Components, LitElement, standards-based development.

---

### 10. Solid.js 🟦
**Port**: 3007  
**Location**: `frontend/solid-app/`

**How to run:**
```bash
cd frontend/solid-app
npm install
npm run dev
# Visit: http://localhost:3007
```

**Features**: Fine-grained reactivity, no virtual DOM, compile-time optimizations.

---

### 11. Astro 🚀
**Port**: 3008  
**Location**: `frontend/astro-app/`

**How to run:**
```bash
cd frontend/astro-app
npm install
npm run dev
# Visit: http://localhost:3008
```

**Features**: Zero JavaScript by default, multi-page application, static site generation.

---

### 12. Flutter 🐦
**Port**: 3009  
**Location**: `frontend/flutter_app/`

**Prerequisites**: Flutter SDK must be installed
```bash
# Install Flutter (Linux/macOS)
sudo snap install flutter --classic

# Or follow official guide: https://flutter.dev/docs/get-started/install
```

**How to run:**
```bash
cd frontend/flutter_app
flutter pub get
flutter run -d chrome --web-port 3009
# Visit: http://localhost:3009
```

**Features**: Cross-platform development, Material Design, Dart language, native performance.

---

## 🗂️ Project Structure

```
framework-comparing/
├── api/                          # Shared Node.js/Express API
│   ├── index.js                 # API server code
│   └── package.json             # API dependencies
├── frontend/
│   ├── plain/                   # Vanilla HTML/JS
│   ├── react/                   # React implementation
│   ├── angular/                 # Angular implementation
│   ├── vue-app/                 # Vue.js implementation
│   ├── svelte-app/              # Svelte implementation
│   ├── alpine-app/              # Alpine.js implementation
│   ├── htmx-app/                # HTMX implementation
│   ├── preact-app/              # Preact implementation
│   ├── lit-app/                 # Lit implementation
│   ├── solid-app/               # Solid.js implementation
│   ├── astro-app/               # Astro implementation
│   └── flutter_app/             # Flutter implementation
└── README.md                    # This file
```

## 🔧 API Endpoints

The shared Node.js API provides the following endpoints:

- `GET /tasks` - Fetch all tasks
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task
- `PATCH /tasks/reorder` - Reorder tasks via drag & drop

## 🎨 Features Comparison

| Framework | Bundle Size | Learning Curve | Performance | Ecosystem | Best For |
|-----------|-------------|----------------|-------------|-----------|----------|
| Vanilla | Minimal | Easy | Excellent | N/A | Simple sites, learning |
| React | Medium | Medium | Good | Huge | SPAs, component reuse |
| Angular | Large | Steep | Good | Large | Enterprise apps |
| Vue.js | Medium | Gentle | Good | Growing | Progressive adoption |
| Svelte | Small | Medium | Excellent | Growing | Performance-critical |
| Alpine.js | Tiny | Easy | Good | Small | Progressive enhancement |
| HTMX | Tiny | Easy | Good | Small | Server-side focused |
| Preact | Small | Easy | Excellent | Medium | Lightweight React |
| Lit | Small | Medium | Excellent | Medium | Web Components |
| Solid.js | Small | Medium | Excellent | Growing | React-like performance |
| Astro | Variable | Medium | Excellent | Growing | Content sites |
| Flutter | Large | Steep | Excellent | Large | Cross-platform apps |

## 🐛 Troubleshooting

### API Connection Issues
- **Problem**: Todo items not loading/saving
- **Solution**: Ensure the API server is running on port 3000
- **Check**: Visit http://localhost:3000/tasks in your browser

### Port Conflicts
- **Problem**: "Port already in use" error
- **Solution**: Kill the process or use a different port
```bash
# Kill process on specific port (replace 3000 with your port)
lsof -ti:3000 | xargs kill
```

### Flutter Issues
- **Problem**: Flutter command not found
- **Solution**: Install Flutter SDK and add to PATH
- **Check**: Run `flutter doctor` for detailed setup info

### Node.js Issues
- **Problem**: npm install fails
- **Solution**: Clear cache and try again
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contributing

Feel free to:
- Add new framework implementations
- Improve existing code
- Fix bugs or add features
- Update documentation

## 📝 License

MIT License - feel free to use this project for learning and experimentation!

---

## 🎓 Learning Resources

- **React**: [Official Tutorial](https://react.dev/learn)
- **Angular**: [Angular Docs](https://angular.io/tutorial)
- **Vue.js**: [Vue Guide](https://vuejs.org/guide/)
- **Svelte**: [Svelte Tutorial](https://svelte.dev/tutorial)
- **Alpine.js**: [Alpine Docs](https://alpinejs.dev/)
- **HTMX**: [HTMX Examples](https://htmx.org/examples/)
- **Preact**: [Preact Guide](https://preactjs.com/guide/v10/getting-started)
- **Lit**: [Lit Tutorial](https://lit.dev/tutorials/)
- **Solid.js**: [Solid Tutorial](https://www.solidjs.com/tutorial)
- **Astro**: [Astro Docs](https://docs.astro.build/)
- **Flutter**: [Flutter Codelabs](https://flutter.dev/docs/codelabs)

Happy coding! 🎉
