import { createRouter, createWebHistory } from 'vue-router'
import TicTacToe from '../views/TicTacToe.vue'
import TodoList from '../views/TodoList.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/tic-tac-toe'
        },
        {
            path: '/tic-tac-toe',
            name: 'tic-tac-toe',
            component: TicTacToe
        },
        {
            path: '/todo',
            name: 'todo',
            component: TodoList
        }
    ]
})

export default router
