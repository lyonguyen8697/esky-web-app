import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { VerifyService } from '../../services/verify.service';
import { LocalStorageService } from '../../services/local-storage.service';
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

    submiting: boolean;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private verify: VerifyService,
        private storage: LocalStorageService) { }

    ngOnInit() {
        this.route.data
        .subscribe(
            (data: { response: any }) => {
                this.submiting = false;
                console.log(data);
                if (!data.response) {
                    this.verifyCase = 0;
                    this.user = this.storage.getUser();
                    if (!this.user) {
                        this.router.navigate(['welcome']);
                    }
                } else if (data.response.jwt) {
                    this.verifyCase = 1;
                    this.storage.setUserToken(data.response.jwt);
                } else {
                    this.verifyCase = 2;
                }
            }
        );
    }

    resendEmail() {
        this.submiting = true;
        this.verify.resendVerify(this.storage.getUser().id)
            .subscribe(res => this.submiting = false);
        console.log('ok');
    }
}
