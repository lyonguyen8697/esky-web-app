import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
    templateUrl: 'home-page.component.html',
    styleUrls: ['home-page.component.css']
})
export class HomePageComponent implements OnInit {

    user: User;

    constructor(private authService: AuthenticationService,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.userService.get()
            .subscribe(user => this.user = user);
    }
}
