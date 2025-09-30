import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navbar } from './navbar/navbar';
import { TicTacToe } from './tic-tac-toe/tic-tac-toe';
import { TodoList } from './todo-list/todo-list';

@NgModule({
    declarations: [
        App,
        Navbar,
        TicTacToe,
        TodoList
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule
    ],
    providers: [
        provideBrowserGlobalErrorListeners()
    ],
    bootstrap: [App]
})
export class AppModule { }
