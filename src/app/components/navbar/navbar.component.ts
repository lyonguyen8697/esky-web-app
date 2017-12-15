import { Component, OnChanges, OnInit, SimpleChanges, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../services/authentication.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Learner } from '../../models/learner.model';
import { LearnerService } from '../../services/learner.service';

declare var $: any;

@Component({
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html',
    styleUrls: ['navbar.component.css']
})
export class NavbarComponent implements OnChanges, OnInit {

    user: User;

    learner: Learner;

    @Input() isSignedIn: boolean;

    constructor(private router: Router,
                private authService: AuthenticationService,
                private userService: UserService,
                private learnerService: LearnerService,
                private storage: LocalStorageService) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.isSignedIn && this.isSignedIn) {
            this.userService.get().subscribe();
            this.learnerService.get().subscribe();
        }
    }

    ngOnInit() {
        this.storage.user
        .subscribe(user => {
            this.user = user;
        });
        this.storage.learner
        .subscribe(learner => {
            this.learner = learner;
        });
    }

    gotoUserInfo() {
        this.router.navigate([this.user ? this.user.username : '']);
        this.hideMenu();
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
