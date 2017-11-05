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

    isShowNavbar = false;

    isSignedIn = false;

    urlHideNabar = new RegExp('^/study*');

    urlSignOut = new RegExp('^/welcome');

    constructor(private router: Router) {}

    ngOnInit() {
        this.subscribeShowNavbar();
        this.subscribeSignedIn();
    }

    subscribeShowNavbar() {
        this.router.events
        .filter(event => event instanceof NavigationEnd)
        .subscribe((event: NavigationEnd ) => this.isShowNavbar = !this.urlHideNabar.test(event.urlAfterRedirects));
    }

    subscribeSignedIn() {
        this.router.events
        .filter(event => event instanceof NavigationEnd)
        .subscribe((event: NavigationEnd) => this.isSignedIn = !this.urlSignOut.test(event.urlAfterRedirects));
    }
}
