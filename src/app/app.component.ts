import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import 'rxjs/Observable';
import 'rxjs/add/operator/filter';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    title = 'app';

    showNavbar = false;

    urlRegex = new RegExp('^/study*');

    constructor(private router: Router) {}

    ngOnInit() {
        this.router.events
        .filter(event => event instanceof NavigationEnd)
        .subscribe((event: NavigationEnd ) => this.showNavbar = this.urlRegex.test(event.urlAfterRedirects) ? false : true);
    }
}
