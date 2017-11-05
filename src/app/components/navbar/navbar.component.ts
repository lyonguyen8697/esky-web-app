import { Component, OnInit, Input } from '@angular/core';

import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../models/user.model';

declare var $: any;

@Component({
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html',
    styleUrls: ['navbar.component.css']
})
export class NavbarComponent implements OnInit {

    user: User;

    @Input() isSignedIn: boolean;

    constructor(private authService: AuthenticationService) {}

    ngOnInit() {
        this.user = User.getLocal();
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
