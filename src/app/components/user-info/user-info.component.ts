import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/operator/debounceTime';

import { UserService } from '../../services/user.service';
import { ValidatorService } from '../../services/validator.service';
import { ModalService } from '../../services/modal.service';
import { TooltipService } from '../../services/tooltip.service';
import { User } from '../../models/user.model';

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

    editing = false;

    updateCount = 0;

    submitted = false;

    serverError: string;

    hideInvalid = false;

    hideInvalidDelay = 500;

    tooltipDelay = 50;

    modalName = 'confirmPasswordModal';

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
                private validator: ValidatorService,
                private modal: ModalService,
                private tooltip: TooltipService) { }

    ngOnInit() {
        this.editable = true;
        this.editing = false;
        this.route.data
        .subscribe(data => {
            this.user = data.user;
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
            .subscribe({error: error => this.updateError(error, this.username)});
        }
        if (this.isNameChange) {
            this.updateCount++;
            this.userService.updateName(this.name.value, this.credentials.value)
            .finally(this.updateComplete.bind(this))
            .subscribe({error: error => this.updateError(error, this.name)});
        }
        if (this.isPasswordChange) {
            this.updateCount++;
            this.userService.updatePassword(this.password.value, this.credentials.value)
            .finally(this.updateComplete.bind(this))
            .subscribe({error: error => this.updateError(error, this.password)});
        }
        this.submitted = true;
        this.serverError = '';
    }

    updateError(error: any, control: AbstractControl) {
        error = error.json();
        if (error.code === 16) {
            this.serverError = 'Sai mật khẩu';
        } else {
            control.setErrors({ 'server': 'error'});
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
        this.hideModal();
        if (this.form.valid) {
            this.updateSuccess();
        } else {
            this.showAllTooltip();
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
        this.credentials.enable();
        this.showModal();
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

    showModal() {
        this.modal.show(this.modalName);
    }

    hideModal() {
        this.modal.hide(this.modalName);
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
                { value: this.user.username, disabled: true},
                Validators.compose([Validators.required, Validators.pattern(this.validator.usernameRegex)]),
                this.validator.usernameExists(this.hideInvalidDelay, this.user.username)
            ),
            name: this.fb.control(
                { value: this.user.name, disabled: true},
                Validators.required
            ),
            password: this.fb.control(
                { value: '******', disabled: true},
                Validators.compose([Validators.required, Validators.minLength(6)])
            ),
            credentials: this.fb.control(
                { value: '', disabled: true},
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

}
