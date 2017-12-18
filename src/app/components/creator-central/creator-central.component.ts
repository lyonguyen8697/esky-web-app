import { Component, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';
import { ContributorService } from '../../services/contributor.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { LessonService } from '../../services/lesson.service';
import { QuestionService } from '../../services/question.service';
import { Question } from '../../models/question.model';
import { Log } from '../../models/log.model';

import { User } from '../../models/user.model';
import { Observable } from 'rxjs/Observable';
import { mergeMap } from 'rxjs/operator/mergeMap';
import { ModalService } from '../../services/modal.service';

declare var $: any;

@Component({
    templateUrl: 'creator-central.component.html',
    styleUrls: ['creator-central.component.css']
})
export class CreatorCentralComponent implements OnInit {

    containers: { log: Log, user?: User }[];

    searchedItem: { log: Log, user?: User }[];

    filterMode = 0;

    searchKey = '';

    logPerLoad = 3;

    waitCount = 0;

    loading: boolean;

    submiting: boolean;

    isManager: boolean;

    confirmModal = 'confirmModal';

    confirmOk: Function;

    confirmCancel: Function;

    confirmContent: string;

    responseModal = 'responseModal';

    serverError: string;

    constructor(public userService: UserService,
        private lessonService: LessonService,
        private local: LocalStorageService,
        private questionService: QuestionService,
        private modal: ModalService) { }

    ngOnInit() {
        this.containers = [];
        this.submiting = false;
        this.isManager = this.local.getUser().role === 'MANAGER';
        this.serverError = '';
        this.loadLogs(this.containers.length, this.logPerLoad);
        this.registerEvent();
    }

    loadLogs(start: number, count: number) {
        this.loading = true;
        this.getLogWithUser(this.lessonService, start, count);
        this.getLogWithUser(this.questionService, start, count);
    }

    getLogWithUser(service: any, start: number, count: number) {
        return service.getLogs(start, count)
            .debounceTime(1000)
            .subscribe(logs => {
                logs.forEach(log => {
                    const container: { log: Log, user?: User } = { log: log };
                    this.containers.push(container);
                    this.getUser(log.contributor)
                        .subscribe(user => container.user = user);
                });
                this.filter();
                this.search();
                this.waitCount = this.containers.filter(container => container.log.accepted === null).length;
                this.loading = false;
            });
    }

    findUser(id: string): User {
        return this.containers.find(container => container.log.contributor === id).user;
    }

    getUser(id: string): Observable<User> {
        let user: User;
        if (user = this.findUser(id)) {
            return Observable.of(user);
        }
        return this.userService.getById(id);
    }

    registerEvent() {
        $('.logs-container').on('scroll', () => {
            if ($('.logs-container').scrollTop() + $('.logs-container').innerHeight() >= $('.logs-container')[0].scrollHeight - 10) {
                this.loadLogs(this.containers.length, this.logPerLoad);
            }
        });
    }

    search() {
        const key = this.searchKey.toLowerCase().trim();
        if (!key) {
            this.filter();
        } else {
            this.searchedItem = this.searchedItem.filter(container => {
                const log = container.log;
                const user = container.user;
                let match = log.id === key || log.contributor === key || log.note.toLowerCase().includes(key);
                if (log.lesson) {
                    match = match || log.lesson.id === key || log.lesson.subject.toLowerCase().includes(key)
                        || log.lesson.title.toLowerCase().includes(key) || log.lesson.description.toLowerCase().includes(key)
                        || log.lesson.level === +key;
                } else {
                    match = match || log.question.id === key || log.question.question.toLowerCase().includes(key)
                        || log.question.phrase.toLowerCase().includes(key) || log.question.voice.toLowerCase().includes(key)
                        || log.question.answers.some(answer => answer.toLowerCase().includes(key))
                        || log.question.choices.some(choice => choice.toLowerCase().includes(key))
                        || log.question.difficulty.toLowerCase().includes(key);
                }
                if (user) {
                    match = match || user.id === key || user.email.toLowerCase().includes(key)
                        || user.username.toLowerCase().includes(key) || user.name.toLowerCase().includes(key)
                        || user.role.toLowerCase().includes(key);
                }
                return match;
            });
        }
    }

    showNew() {
        this.filterMode = 0;
        this.filter();
        this.search();
    }

    showWait() {
        this.filterMode = 1;
        this.filter();
    }

    filter() {
        if (this.filterMode === 0) {
            this.searchedItem = this.containers;
        } else if (this.filterMode === 1) {
            this.searchedItem = this.containers.filter(item => item.log.accepted === null);
        }
    }

    accept(event: { log: Log, update: Function }) {
        if (this.isManager && !this.submiting) {
            this.submiting = true;
            if (event.log.lesson) {
                this.lessonService.acceptContribute(event.log.id)
                    .finally(() => {
                        this.submiting = false;
                        event.update();
                        this.showModal(this.responseModal);
                    })
                    .subscribe(
                    () => {
                        this.serverError = '';
                    },
                    (error) => {
                        this.serverError = error.message;
                    });
            } else {
                this.questionService.acceptContribute(event.log.id)
                    .finally(() => {
                        this.submiting = false;
                        event.update();
                        this.showModal(this.responseModal);
                    })
                    .subscribe(
                    () => {
                        this.serverError = '';
                    },
                    (error) => {
                        this.serverError = error.message;
                    });
            }
        }
    }

    reject(event: { log: Log, update: Function }) {
        this.submiting = true;
        if (event.log.lesson) {
            this.lessonService.rejectContribute(event.log.id)
                .finally(() => {
                    this.submiting = false;
                    event.update();
                    this.showModal(this.responseModal);
                })
                .subscribe(
                () => {
                    this.serverError = '';
                },
                (error) => {
                    this.serverError = error.message;
                });
        } else {
            this.questionService.rejectContribute(event.log.id)
                .finally(() => {
                    this.submiting = false;
                    event.update();
                    this.showModal(this.responseModal);
                })
                .subscribe(
                () => {
                    this.serverError = '';
                },
                (error) => {
                    this.serverError = error.message;
                });
        }
    }

    acceptButtonClicked(event: { log: Log, update: Function }) {
        if (this.isManager && !this.submiting) {
            this.confirm({
                content: `Bạn có muốn chấp nhận đề xuất này`,
                ok: () => {
                    this.hideModal(this.confirmModal);
                    this.accept(event);
                },
                cancel: () => this.hideModal(this.confirmModal)
            });
        }
    }

    rejectButtonClicked(event: { log: Log, update: Function }) {
        if (this.isManager && !this.submiting) {
            this.confirm({
                content: `Bạn có muốn từ chối đề xuất này`,
                ok: () => {
                    this.hideModal(this.confirmModal);
                    this.reject(event);
                },
                cancel: () => this.hideModal(this.confirmModal)
            });
        }
    }

    confirm(option: { content, ok: Function, cancel: Function}) {
        this.confirmContent = option.content;
        this.confirmOk = option.ok;
        this.confirmCancel = option.cancel;
        this.showModal(this.confirmModal);
    }

    showModal(modal: string) {
        this.modal.show(modal);
    }

    hideModal(modal: string) {
        this.modal.hide(modal);
    }
}
