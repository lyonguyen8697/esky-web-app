import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '../../models/user.model';

import 'rxjs/add/operator/switchMap';

@Component({
    templateUrl: 'verify-page.component.html',
    styleUrls: ['verify-page.component.html']
})
export class VerifyPageComponent implements OnInit {

    user: User;

    token: string;

    verifyCase: number;

    constructor(private router: Router,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.data
        .subscribe(
            (data: { response: any }) => {
                console.log(data);
                if (!data.response) {
                    this.verifyCase = 0;
                    this.user = User.getLocal();
                    if (!this.user) {
                        this.router.navigate(['welcome']);
                    }
                } else if (data.response.jwt) {
                    this.verifyCase = 1;
                    User.setToken(data.response.jwt);
                } else {
                    this.verifyCase = 2;
                }
            }
        );
    }
}
