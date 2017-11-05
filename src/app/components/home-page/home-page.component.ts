import { Component } from '@angular/core';

import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';

@Component({
    templateUrl: 'home-page.component.html',
    styleUrls: [ 'home-page.component.css']
})
export class HomePageComponent {

    constructor(
        private authService: AuthenticationService,
        private userService: UserService
    ) { }

    signOut() {
        this.authService.signOut();
    }

    getMessage() {
        this.userService.test().subscribe(res => console.log(res));
    }
}
