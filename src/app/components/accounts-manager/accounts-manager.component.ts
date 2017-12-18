import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../services/user.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { ModalService } from '../../services/modal.service';
import { User } from '../../models/user.model';
import { Role } from '../../enums/role.emum';

@Component({
    templateUrl: 'accounts-manager.component.html',
    styleUrls: ['accounts-manager.component.css']
})

export class AccountsManagerComponent implements OnInit {

    users: User[];

    selected: User;

    filter: any;

    search: string;

    showBlock: boolean;

    showNotVerified: boolean;

    showInactive: boolean;

    inactiveTime: Date;

    submiting: boolean;

    confirmModal = 'confirmModal';

    confirmOk: Function;

    confirmCancel: Function;

    confirmContent: string;

    responseModal = 'responseModal';

    serverError: string;

    get isHigherRole(): boolean {
        if (this.selected && Role[this.local.getUser().role] > Role[this.selected.role]) {
            return true;
        }
        return false;
    }

    constructor(private router: Router,
                private userService: UserService,
                private local: LocalStorageService,
                private modal: ModalService) { }

    ngOnInit() {
        this.showBlock = false;
        this.showNotVerified = false;
        this.showInactive = true;
        this.inactiveTime = new Date();
        this.inactiveTime.setMonth(this.inactiveTime.getMonth() - 3);

        this.filterChanged();

        this.submiting = false;

        this.userService.getAll()
            .subscribe(users => {
                this.users = users;
            });
    }

    filterChanged() {
        this.filter = {
            verified: this.showNotVerified ? undefined : true,
            deleted: this.showBlock ? undefined : false,
            lastChange: this.showInactive ? undefined :
                { value: this.inactiveTime, comparer: (a, b) => a > b }
        };
        this.selected = null;
    }

    rowClicked(user: User) {
        if (this.submiting) {
            return;
        }
        if (this.isSelected(user)) {
            this.selected = null;
        } else {
            this.selected = user;
        }
    }

    isSelected(user: User): boolean {
        return this.selected === user;
    }

    gotoUserProfile() {
        if (this.selected) {
            this.router.navigate([this.selected.username]);
        }
    }

    blockButtonClicked() {
        this.confirm({
            content: `Bạn có muốn khóa tài khoản ${this.selected.username} không ?`,
            ok: () => {
                this.hideModal(this.confirmModal);
                this.block();
            },
            cancel: () => this.hideModal(this.confirmModal)
        });
    }

    restoreButtonClicked() {
        this.confirm({
            content: `Bạn có muốn mở khóa tài khoản ${this.selected.username} không ?`,
            ok: () => {
                this.hideModal(this.confirmModal);
                this.restore();
            },
            cancel: () => this.hideModal(this.confirmModal)
        });
    }

    responseModalAccept() {
        this.submiting = false;
        this.serverError = '';
    }

    responseModalAcceptButtonClicked() {
        this.hideModal(this.responseModal);
        this.responseModalAccept();
    }

    block() {
        this.submiting = true;
        this.userService.block(this.selected.id)
            .subscribe(error => {
                if (!error.message) {
                    this.selected.deleted = true;
                    this.selected = null;
                    this.refreshPresentation();
                } else {
                    this.serverError = error.message;
                }
                this.showModal(this.responseModal);
            });
    }

    restore() {
        this.submiting = true;
        this.userService.restore(this.selected.id)
            .subscribe(error => {
                if (!error.message) {
                    this.selected.deleted = false;
                    this.refreshPresentation();
                } else {
                    this.serverError = error.message;
                }
                this.showModal(this.responseModal);
            });
    }

    refreshPresentation() {
        const users = this.users;
        this.users = [];
        window.setTimeout(() => this.users = users);
    }

    confirm(option: { content, ok: Function, cancel: Function }) {
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
