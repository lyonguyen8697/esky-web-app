import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../services/authentication.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

declare var $: any;

@Component({
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html',
    styleUrls: ['navbar.component.css']
})
export class NavbarComponent implements OnInit {

    user: User;

    @Input() isSignedIn: boolean;

    constructor(private router: Router,
                private authService: AuthenticationService,
                private userService: UserService,
                private storage: LocalStorageService) {}

    ngOnInit() {
        this.storage.user
        .subscribe(user => this.user = user);
        this.userService.get().subscribe();
    }

    gotoUserInfo() {
        this.router.navigate([]);
    }

    signOut() {
        this.authService.signOut();
    }

    toggleMenu() {
        $('.user-menu').slideToggle(200);
    }

    hideMenu() {
        $('.user-menu').slideUp(200);
    }
}
