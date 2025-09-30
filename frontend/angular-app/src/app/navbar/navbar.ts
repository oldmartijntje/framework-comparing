import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    standalone: false,
    templateUrl: './navbar.html',
    styleUrl: './navbar.css'
})
export class Navbar {

    constructor(private router: Router) { }

    isActive(route: string): boolean {
        return this.router.url === route || this.router.url === `/${route}`;
    }
}
