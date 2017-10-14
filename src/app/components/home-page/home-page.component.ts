import { Component } from '@angular/core';

import { AuthenticationService } from '../../services/authentication.service';

@Component({
    templateUrl: 'home-page.component.html',
    styleUrls: [ 'home-page.component.css']
})
export class HomePageComponent {

    constructor(private authService: AuthenticationService) { }

    signOut() {
        this.authService.signOut();
    }
}
