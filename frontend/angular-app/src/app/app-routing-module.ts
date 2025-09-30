import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicTacToe } from './tic-tac-toe/tic-tac-toe';
import { TodoList } from './todo-list/todo-list';

const routes: Routes = [
    { path: '', redirectTo: '/tic-tac-toe', pathMatch: 'full' },
    { path: 'tic-tac-toe', component: TicTacToe },
    { path: 'todo', component: TodoList }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
