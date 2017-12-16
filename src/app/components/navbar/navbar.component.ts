import { Component, OnChanges, OnInit, SimpleChanges, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { LearnerService } from '../../services/learner.service';
import { ContributorService } from '../../services/contributor.service';
import { LessonService } from '../../services/lesson.service';
import { QuestionService } from '../../services/question.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { User } from '../../models/user.model';
import { Learner } from '../../models/learner.model';
import { ItemMetadata } from '../../models/item-metadata.model';
import { Role } from '../../enums/role.emum';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/fromEvent';

declare var $: any;

@Component({
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html',
    styleUrls: ['navbar.component.css']
})
export class NavbarComponent implements OnChanges, OnInit {

    @Input() isSignedIn: boolean;

    user: User;

    learner: Learner;

    searchKey = '';

    userItems: ItemMetadata[];

    lessonItems: ItemMetadata[];

    questionItems: ItemMetadata[];

    searchDelay = 500;

    sortedBlock: any[];

    get isOneColumn() {
        return [this.userItems, this.lessonItems, this.questionItems]
            .filter(n => n ? n.length > 0 : false).length === 1;
    }

    constructor(private router: Router,
        private authService: AuthenticationService,
        private userService: UserService,
        private learnerService: LearnerService,
        private contributorService: ContributorService,
        private lessonService: LessonService,
        private questionService: QuestionService,
        private storage: LocalStorageService) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.isSignedIn && this.isSignedIn) {
            this.userService.get().subscribe();
            this.learnerService.get().subscribe();
            this.userItems = [];
            this.lessonItems = [];
            this.questionItems = [];
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
        Observable.fromEvent(window, 'resize')
            .debounceTime(100)
            .subscribe(() => {
                this.ajustSearchPanel();
            });
    }

    search() {
        this.searchKey = this.searchKey.trim();
        if (this.searchKey.length === 0) {
            this.clearSearch();
            return;
        }
        const role = Role[this.user.role];
        this.userService.search(this.searchKey)
            .debounceTime(this.searchDelay)
            .subscribe(items => {
                this.userItems = items;
                this.ajustSearchPanel();
            });
        if (role > Role.LEARNER) {
            this.lessonService.search(this.searchKey)
                .debounceTime(this.searchDelay)
                .subscribe(items => {
                    this.lessonItems = items;
                    this.ajustSearchPanel();
                });
            this.questionService.search(this.searchKey)
                .debounceTime(this.searchDelay)
                .subscribe(items => {
                    this.questionItems = items;
                    this.ajustSearchPanel();
                });
        }
    }

    gotoUserProfile() {
        this.router.navigate([this.user ? this.user.username : '']);
        this.hideMenu();
    }

    signOut() {
        this.authService.signOut();
    }

    searchItemClicked() {
        this.searchKey = '';
        this.clearSearch();
        this.hideSearchPanel();
    }

    clearSearch() {
        this.userItems = [];
        this.lessonItems = [];
        this.questionItems = [];
    }

    ajustSearchPanel() {
        if (window.innerWidth >= 992) {
            const largeBlock = $('#large-block')[0];
            const smallBlock = $('#small-block')[0];
            const userBlock = { template: $('#user-items'), data: this.userItems };
            const lessonBlock = { template: $('#lesson-items'), data: this.lessonItems };
            const questionBlock = { template: $('#question-items'), data: this.questionItems };
            this.sortedBlock = [userBlock, lessonBlock, questionBlock].sort((a, b) => a.data.length > b.data.length ? 1 : 0);

            this.sortedBlock[0].template.appendTo(smallBlock);
            if (!smallBlock.contains(this.sortedBlock[1].template.id)) {
                this.sortedBlock[1].template.appendTo(smallBlock);
            }
            if (!largeBlock.contains(this.sortedBlock[2].template.id)) {
                this.sortedBlock[2].template.appendTo(largeBlock);
            }
            this.ajustSearchPanelHeight(this.sortedBlock[2].template, this.sortedBlock[1].template, this.sortedBlock[0].template);
        } else {
            const largeBlock = $('#large-block')[0];
            const smallBlock = $('#small-block')[0];
            const userBlock = { template: $('#user-items'), data: this.userItems };
            const lessonBlock = { template: $('#lesson-items'), data: this.lessonItems };
            const questionBlock = { template: $('#question-items'), data: this.questionItems };
            this.sortedBlock = [userBlock, lessonBlock, questionBlock].sort((a, b) => a.data.length > b.data.length ? 1 : 0);

            if (!largeBlock.contains(this.sortedBlock[0].template.id)) {
                this.sortedBlock[0].template.appendTo(largeBlock);
            }
            if (!smallBlock.contains(this.sortedBlock[1].template.id)) {
                this.sortedBlock[1].template.appendTo(smallBlock);
            }
            if (!smallBlock.contains(this.sortedBlock[2].template.id)) {
                this.sortedBlock[2].template.appendTo(smallBlock);
            }
            this.ajustSearchPanelHeight(this.sortedBlock[2].template, this.sortedBlock[1].template, this.sortedBlock[0].template);
        }
    }

    ajustSearchPanelHeight(large: any, medium: any, small: any) {
        const smallHeight = small.find('.search-items').height();
        const mediumHeight = medium.find('.search-items').height();
        if (window.innerWidth >= 992) {
            if (smallHeight > window.innerHeight * 0.4 - 10
                && mediumHeight > window.innerHeight * 0.4 - 10) {
                small.find('.search-items').css('max-height', window.innerHeight * 0.4 - 10);
                medium.find('.search-items').css('max-height', window.innerHeight * 0.4 - 10);
            } else {
                medium.find('.search-items')
                    .css('max-height', window.innerHeight * 0.8 - smallHeight - 20);
            }
            large.find('.search-items').css('max-height', window.innerHeight * 0.8);
        } else {
            if (smallHeight > window.innerHeight * 0.25 - 40) {
                small.find('.search-items').css('max-height', window.innerHeight * 0.25 - 40);
                medium.find('.search-items').css('max-height', window.innerHeight * 0.25 - 40);
                large.find('.search-items').css('max-height', window.innerHeight * 0.25 - 40);
            } else if (mediumHeight > (window.innerHeight * 0.8 - smallHeight - 40) / 2) {
                medium.find('.search-items').css('max-height', (window.innerHeight * 0.8 - smallHeight - 40) / 2);
                large.find('.search-items').css('max-height', (window.innerHeight * 0.8 - smallHeight - 40) / 2);
            } else {
                large.find('.search-items').css('max-height',
                    window.innerHeight * 0.8 - smallHeight - mediumHeight - 40);
            }
        }
    }

    showSearchPanel() {
        $('.search-bar').animate({
            width: '100%'
        }, 200, () => {
            $('.search-panel').slideDown(200);
        });
    }

    hideSearchPanel() {
        $('.search-panel').slideUp(200, () => {
            $('.search-bar').animate({
                width: '200px'
            }, 200);
        });
    }

    toggleSearchPanel() {
        $('.search-panel').slideToggle(300);
    }

    toggleMenu() {
        $('.user-menu').slideToggle(200);
    }

    hideMenu() {
        $('.user-menu').slideUp(200);
    }
}
