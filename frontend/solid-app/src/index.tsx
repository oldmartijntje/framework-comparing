/* @refresh reload */
import { render } from 'solid-js/web';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import App from './App';

const root = document.getElementById('root');

render(() => <App />, root!);
