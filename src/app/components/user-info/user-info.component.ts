import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/operator/debounceTime';

import { UserService } from '../../services/user.service';
import { ContributorService } from '../../services/contributor.service';
import { ManagerService } from '../../services/manager.service';
import { UserInfoValidatorService } from '../../services/user-info-validator.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { ModalService } from '../../services/modal.service';
import { TooltipService } from '../../services/tooltip.service';
import { User } from '../../models/user.model';
import { Role } from '../../enums/role.emum';

declare var $: any;

@Component({
    selector: 'app-user-info',
    templateUrl: 'user-info.component.html',
    styleUrls: ['user-info.component.css']
})
export class UserInfoComponent implements OnInit {

    form: FormGroup;

    user: User;

    editable: boolean;

    appointable: boolean;

    editing = false;

    updateCount = 0;

    submitted = false;

    serverError: string;

    hideInvalid = false;

    hideInvalidDelay = 500;

    tooltipDelay = 50;

    passwordConfirmModal = 'confirmPasswordModal';

    confirmModal = 'confirmModal';

    confirmOk: Function;

    confirmCancel: Function;

    confirmContent: string;

    keydown = new EventEmitter<string>();

    get username() {
        return this.form.get('username');
    }

    get name() {
        return this.form.get('name');
    }

    get password() {
        return this.form.get('password');
    }

    get credentials() {
        return this.form.get('credentials');
    }

    get isUsernameChange(): boolean {
        return this.username.value !== this.user.username;
    }

    get isNameChange(): boolean {
        return this.name.value.trim() !== this.user.name.trim();
    }

    get isPasswordChange(): boolean {
        return this.password.dirty;
    }

    get isFormChanges(): boolean {
        return this.isUsernameChange || this.isNameChange || this.isPasswordChange;
    }

    constructor(private route: ActivatedRoute,
        private fb: FormBuilder,
        private location: Location,
        private userService: UserService,
        private contributorService: ContributorService,
        private managerService: ManagerService,
        private validator: UserInfoValidatorService,
        private local: LocalStorageService,
        private modal: ModalService,
        private tooltip: TooltipService) { }

    ngOnInit() {
        this.editing = false;
        this.route.data
            .subscribe(data => {
                this.user = data.user;
                this.editable = this.canEdit();
                this.appointable = this.canAppoint();
                this.createForm();
                this.registerKeydown();
            });
    }

    resetForm() {
        this.form.reset({
            username: this.user.username,
            name: this.user.name,
            password: '******',
            credentials: ''
        });
    }

    registerKeydown() {
        Object.keys(this.form.controls)
            .forEach(key => {
                const control = this.form.get(key);
                control.valueChanges
                    .subscribe(() => {
                        control.markAsPristine();
                    });
            });
        this.keydown
            .do(() => this.hideAllTooltip())
            .debounceTime(this.hideInvalidDelay)
            .subscribe(key => {
                const control = this.form.get(key);
                control.markAsDirty();
                this.showTooltip(key, this.tooltipDelay);
            });
    }

    onKeydown(control: string) {
        this.keydown.emit(control);
    }

    submit() {
        if (this.isUsernameChange) {
            this.updateCount++;
            this.userService.updateUsername(this.username.value, this.credentials.value)
                .finally(this.updateComplete.bind(this))
                .subscribe({ error: error => this.updateError(error, this.username) });
        }
        if (this.isNameChange) {
            this.updateCount++;
            this.userService.updateName(this.name.value, this.credentials.value)
                .finally(this.updateComplete.bind(this))
                .subscribe({ error: error => this.updateError(error, this.name) });
        }
        if (this.isPasswordChange) {
            this.updateCount++;
            this.userService.updatePassword(this.password.value, this.credentials.value)
                .finally(this.updateComplete.bind(this))
                .subscribe({ error: error => this.updateError(error, this.password) });
        }
        this.submitted = true;
        this.serverError = '';
    }

    updateError(error: any, control: AbstractControl) {
        error = error.json();
        if (error.code === 16) {
            this.serverError = 'Sai mật khẩu';
        } else {
            control.setErrors({ 'server': 'error' });
        }
    }

    updateComplete() {
        this.updateCount--;
        if (this.updateCount !== 0) {
            return;
        }
        this.submitted = false;
        if (this.serverError) {
            return;
        }
        this.hideModal(this.passwordConfirmModal);
        if (this.form.valid) {
            this.updateSelfSuccess();
        } else {
            this.showAllTooltip();
        }
    }

    updateSelfSuccess() {
        this.userService.get()
            .subscribe(user => {
                this.user = user;
                this.cancelEdit();
                this.updateUrl();
                this.username.setAsyncValidators(this.validator.usernameExists(this.hideInvalidDelay, this.user.username));
            });
    }

    updateUrl() {
        this.location.replaceState(this.user.username);
    }

    edit() {
        this.editing = true;
        this.enableForm();
    }

    cancelEdit() {
        this.editing = false;
        this.disableForm();
        this.resetForm();
        this.hideAllTooltip();
    }

    save() {
        if (this.user.id === this.local.getUser().id) {
            this.credentials.enable();
            this.showModal(this.passwordConfirmModal);
        } else {
            if (this.isUsernameChange) {
                this.userService.updateAccountUsername(this.user.id, this.username.value)
                    .subscribe(() => this.updateSuccess());
            }
            if (this.isNameChange) {
                this.userService.updateAccountName(this.user.id, this.name.value)
                    .subscribe(() => this.updateSuccess());
            }
            if (this.isPasswordChange) {
                this.userService.updateAccountPassword(this.user.id, this.password.value)
                    .subscribe(() => this.updateSuccess());
            }
        }
    }

    updateSuccess() {
        this.userService.getById(this.user.id)
            .subscribe(user => {
                this.user = user;
                this.cancelEdit();
                this.updateUrl();
                this.username.setAsyncValidators(this.validator.usernameExists(this.hideInvalidDelay, this.user.username));
            });
    }

    appoint() {
        if (this.appointable && !this.editing) {
            if (this.user.role === 'LEARNER') {
                this.confirm({
                    content: `Bạn có muốn bổ nhiệm ${this.user.name} thành Cộng tác viên`,
                    ok: () => {
                        this.hideModal(this.confirmModal);
                        this.contributorService.appoint(this.user.id)
                            .subscribe(res => {
                                this.userService.getById(this.user.id)
                                .subscribe(user => {
                                    this.user = user;
                                    this.appointable = this.canAppoint();
                                });
                            });
                    },
                    cancel: () => this.hideModal(this.confirmModal)
                });
            }
            if (this.user.role === 'CONTRIBUTOR') {
                this.confirm({
                    content: `Bạn có muốn bổ nhiệm ${this.user.name} thành Quản trị viên`,
                    ok: () => {
                        this.hideModal(this.confirmModal);
                        this.managerService.appoint(this.user.id)
                            .subscribe(res => {
                                this.userService.getById(this.user.id)
                                .subscribe(user => {
                                    this.user = user;
                                    this.appointable = this.canAppoint();
                                });
                            });
                    },
                    cancel: () => this.hideModal(this.confirmModal)
                });
            }
        }
    }

    modalHided() {
        this.credentials.disable();
        this.credentials.setValue('');

    }

    enableForm() {
        this.username.enable();
        this.name.enable();
        this.password.enable();
    }

    disableForm() {
        this.username.disable();
        this.name.disable();
        this.password.disable();
    }

    showModal(modal: string) {
        this.modal.show(modal);
    }

    hideModal(modal: string) {
        this.modal.hide(modal);
    }

    showTooltip(name: string, delay = 0) {
        this.tooltip.show(`.tooltip-${name} a`, delay);
    }

    hideTooltip(name: string, delay = 0) {
        this.tooltip.hide(`.tooltip-${name} a`, delay);
    }

    showAllTooltip(delay = 0) {
        this.tooltip.show('.tooltip-wrap a', delay);
    }

    hideAllTooltip(delay = 0) {
        this.tooltip.hide('.tooltip-wrap a', delay);
    }

    toggleAllTooltip(delay = 0) {
        this.tooltip.toggle('.tooltip-wrap a', delay);
    }

    createForm() {
        this.form = this.fb.group({
            username: this.fb.control(
                { value: this.user.username, disabled: true },
                Validators.compose([Validators.required, Validators.pattern(this.validator.usernameRegex)]),
                this.validator.usernameExists(this.hideInvalidDelay, this.user.username)
            ),
            name: this.fb.control(
                { value: this.user.name, disabled: true },
                Validators.required
            ),
            password: this.fb.control(
                { value: '******', disabled: true },
                Validators.compose([Validators.required, Validators.minLength(6)])
            ),
            credentials: this.fb.control(
                { value: '', disabled: true },
                Validators.required
            )
        });
    }

    isInvalid(control: AbstractControl): boolean {
        return control.invalid && control.dirty && this.editing;
    }

    getErrorMessage(name: string, control: AbstractControl): string {
        return this.validator.getErrorMessage(name, control);
    }

    onPasswordFocus() {
        if (this.password.pristine) {
            this.password.setValue('');
        }
    }

    canEdit(): boolean {
        const currentUser = this.local.getUser();
        if (this.user.id === currentUser.id) {
            return true;
        }
        const currentRole = Role[this.local.getUser().role];
        const userRole = Role[this.user.role];
        if (currentRole > Role.CONTRIBUTOR && currentRole > userRole) {
            return true;
        }
        return false;
    }

    confirm(option: { content, ok: Function, cancel: Function }) {
        this.confirmContent = option.content;
        this.confirmOk = option.ok;
        this.confirmCancel = option.cancel;
        this.showModal(this.confirmModal);
    }

    canAppoint(): boolean {
        const currentRole = Role[this.local.getUser().role];
        const userRole = Role[this.user.role];
        if (currentRole === Role.MANAGER && userRole === Role.LEARNER) {
            return true;
        } else if (currentRole === Role.ADMIN && (userRole === Role.LEARNER || userRole === Role.CONTRIBUTOR)) {
            return true;
        }
        return false;
    }

}
