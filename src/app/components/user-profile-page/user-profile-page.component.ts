import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User } from '../../models/user.model';

@Component({
    templateUrl: 'user-profile-page.component.html',
    styleUrls: ['user-profile-page.component.css']
})
export class UserProfilePageComponent implements OnInit {

    user: User;

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.data
            .subscribe(data => {
                this.user = data.user;
            });
    }
}
