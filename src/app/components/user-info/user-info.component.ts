import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { UserService } from '../../services/user.service';
import { ValidatorService } from '../../services/validator.service';
import { TooltipService } from '../../services/tooltip.service';
import { User } from '../../models/user.model';
import { UserUpdateInfo } from '../../models/user-update-info.model';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

declare var $: any;

@Component({
    selector: 'app-user-info',
    templateUrl: 'user-info.component.html',
    styleUrls: ['user-info.component.css']
})
export class UserInfoComponent implements OnInit {

    user: User;

    info = new UserUpdateInfo;

    editable: boolean;

    editing = false;

    infoChanged = false;

    passwordChanged = false;

    updateCount = 0;

    submitted = false;

    serverError = '';

    passwordValidate = '';

    timeoutId = new Array<number>();

    validateDelay = 500;

    tooltipDelay = 50;

    constructor(private route: ActivatedRoute,
                private location: Location,
                private userService: UserService,
                private validator: ValidatorService,
                private tooltip: TooltipService) { }

    ngOnInit() {
        this.editable = true;
        this.route.data
        .subscribe(data => {
            this.user = data.user;
            this.resetInfo();
        });
    }

    submit() {
        if (this.info.username.toLowerCase() !== this.user.username.toLowerCase()) {
            this.updateCount++;
            this.userService.updateUsername(this.info)
            .subscribe(error => this.updateUsernameComplete(error));
        }
        if (this.info.name !== this.user.name) {
            this.updateCount++;
            this.userService.updateName(this.info)
            .subscribe(error => this.updateNameComplete(error));
        }
        if (this.passwordChanged) {
            this.updateCount++;
            this.userService.updatePassword(this.info)
            .subscribe(error => this.updatePasswordComplete(error));
        }
        this.submitted = true;
        this.serverError = '';
    }

    updateUsernameComplete(error) {
        if (error.status !== 200) {
            if (error.code = 16) {
                this.serverError = 'Sai mật khẩu';
                this.submitted = false;
                this.updateCount--;
                return;
            }
            this.info.usernameError = true;
        }
        this.updateComplete();
    }

    updateNameComplete(error) {
        if (error.status !== 200) {
            if (error.code = 16) {
                this.serverError = 'Sai mật khẩu';
                this.submitted = false;
                this.updateCount--;
                return;
            }
            this.info.nameError = true;
        }
        this.updateComplete();
    }

    updatePasswordComplete(error) {
        if (error.status !== 200) {
            if (error.code = 16) {
                this.serverError = 'Sai mật khẩu';
                this.submitted = false;
                this.updateCount--;
                return;
            }
            this.info.passwordError = true;
        }
        this.updateComplete();
    }

    updateComplete() {
        this.updateCount--;
        if (this.updateCount === 0 && this.submitted) {
            $('#confirmPasswordModal').modal('hide');
            this.submitted = false;
            if (this.info.validated) {
                this.updateSuccess();
            }
        }
    }

    updateSuccess() {
        this.userService.get()
        .subscribe(user => {
            this.user = user;
            this.cancelEdit();
            this.updateUrl();
        });
    }

    updateUrl() {
        this.location.replaceState(this.user.username);
    }

    save() {
        this.validateAll(() => {
            if (this.info.validated) {
                $('#confirmPasswordModal').modal();
            } else {
                this.showAllTooltip(this.tooltipDelay);
            }
        });
    }

    edit() {
        this.editing = true;
    }

    cancelEdit() {
        this.editing = false;
        this.passwordChanged = false;
        this.infoChanged = false;
        this.resetInfo();
        this.hideAllTooltip();
    }

    resetInfo() {
        this.info.reset();
        this.info.currentUsername = this.user.username;
        this.info.username = this.user.username;
        this.info.name = this.user.name;
        this.info.password = '********';
    }

    validateAll(handler?: Function) {
        this.validator.validate(this.info).then(() => {
            if (handler) {
                handler();
            }
        });
    }

    validate(validate: Function, index: number) {
        clearTimeout(this.timeoutId[index]);
        this.timeoutId[index] = window.setTimeout(() => validate(), this.validateDelay);
    }

    onUsernameChange() {
        this.tooltip.hide('.tooltip-username a');
        this.info.usernameError = null;
        this.validate(() => {
            this.validator.username(this.info)
            .subscribe(() => {
                this.tooltip.show('.tooltip-username a', this.tooltipDelay);
                this.detectChanges();
            });
        }, 0);
    }

    onNameChange() {
        this.tooltip.hide('.tooltip-name a');
        this.info.nameError = null;
        this.validate(() => {
            this.validator.name(this.info);
            this.tooltip.show('.tooltip-name a', this.tooltipDelay);
            this.detectChanges();
        }, 1);
    }

    onPasswordChange() {
        if (this.editing) {
            this.tooltip.hide('.tooltip-password a');
            this.info.passwordError = null;
            this.validate(() => {
                this.validator.password(this.info);
                this.tooltip.show('.tooltip-password a', this.tooltipDelay);
                this.detectChanges();
            }, 2);
        }
    }

    onFocusPassword() {
        if (!this.passwordChanged && this.editing) {
            this.passwordChanged = true;
            this.info.password = '';
        }
    }

    detectChanges() {
        this.infoChanged = this.info.username.toLowerCase() !== this.user.username.toLowerCase()
                            || this.info.name !== this.user.name
                            || this.passwordChanged;
    }

    showAllTooltip(delay = 0) {
        this.tooltip.show('.tooltip-container a', delay);
    }

    hideAllTooltip(delay = 0) {
        this.tooltip.hide('.tooltip-container a', delay);
    }

    toggleAllTooltip(delay = 0) {
        this.tooltip.toggle('.tooltip-container a', delay);
    }


}
