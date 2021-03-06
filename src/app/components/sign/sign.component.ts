import { Component } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition,
    keyframes
 } from '@angular/animations';
 import { Router } from '@angular/router';

 declare var $: any;

import { AuthenticationService } from '../../services/authentication.service';
import { UserService } from '../../services/user.service';
import { UserInfoValidatorService } from '../../services/user-info-validator.service';
import { User } from '../../models/user.model';
import { TooltipService } from '../../services/tooltip.service';
import { rotateInOut } from '../../animations/rotate-in-out.animation';
import { SignUpInfo } from '../../models/sign-up-info.model';

@Component({
    selector: 'app-sign',
    templateUrl: 'sign.component.html',
    styleUrls: ['sign.component.css'],
    animations: [
        rotateInOut('200ms'),
        trigger('fadeInOut', [
            transition(':enter', [
                style({ transform: 'translateY(-100%)', opacity: 0}),
                animate(200)
            ]),
            transition(':leave', [
                animate(200, style({ transform: 'translateY(-100%)', opacity: 0}))
            ])
        ]),
        trigger('flyUpDown', [
            state('signIn', style({ 'margin-top': 0})),
            state('signUp', style({ 'margin-top': 0})),
            transition('signUp => signIn', [
                animate(200, keyframes([
                    style({ 'margin-top': -54, offset: 1.0})
                ]))
            ]),
            transition('signIn => signUp', [
                animate(200, keyframes([
                    style({ 'margin-top': -54, offset: 0}),
                    style({ 'margin-top': 0, offset: 1.0})
                ]))
            ])
        ]),
        trigger('changeColor', [
            state('signIn', style({ 'background-color': '#626', 'border-color': '#626'})),
            state('signUp', style({ 'background-color': '#FD6504', 'border-color': '#FD6504'})),
            transition('signUp <=> signIn', [
                animate(400)
            ])
        ])
    ]
})
export class SignComponent {

    isSignUp = true;

    state = 'signUp';

    isCollapsing: boolean;

    info = new SignUpInfo();

    serverError = '';

    submitted = false;

    timeoutId = new Array<number>();

    validateDelay = 500;

    tooltipDelay = 50;

    constructor(private router: Router,
        private authService: AuthenticationService,
        private user: UserService,
        private validator: UserInfoValidatorService,
        private tooltip: TooltipService) { }

    submit() {
        this.submitted = true;
        this.hideServerError();
        if (this.isSignUp) {
            this.signUp();
        } else {
            this.signIn();
        }
    }

    signUp() {
        if (this.info.validated) {
            this.user.signUp(this.info, error => this.onError(error));
        } else {
            this.validateAll();
            this.showAllTooltip(this.tooltipDelay);
            this.submitted = false;
        }
    }

    signIn() {
        this.authService.signIn({ email: this.info.email, password: this.info.password },
            error => this.onError(error));
    }

    onError(message: string) {
        this.submitted = false;
        this.serverError = message;
        this.showServerError();
    }

    validateAll() {
        this.validator.validate(this.info).then(res => {
            console.log(res);
        });
    }

    validate(validate: Function, index: number) {
        clearTimeout(this.timeoutId[index]);
        this.timeoutId[index] = window.setTimeout(() => validate(), this.validateDelay);
    }

    onEmailChange() {
        if (this.isSignUp) {
            this.tooltip.hide('.tooltip-email a');
            this.info.emailError = null;
            this.validate(() => this.validator.email(this.info)
            .subscribe(() => this.tooltip.show('.tooltip-email a', this.tooltipDelay)), 0);
        }
    }

    onNameChange() {
        this.tooltip.hide('.tooltip-name a');
        this.info.nameError = null;
        this.validate(() => {
            this.validator.name(this.info);
            this.tooltip.show('.tooltip-name a', this.tooltipDelay);
        }, 1);
    }

    onPasswordChange() {
        if (this.isSignUp) {
            this.tooltip.hide('.tooltip-password a');
            this.info.passwordError = null;
            this.validate(() => {
                this.validator.password(this.info);
                this.tooltip.show('.tooltip-password a', this.tooltipDelay);
            }, 2);
        }
    }

    onConfirmPasswordChange() {
        this.tooltip.hide('.tooltip-confirmPassword a');
        this.info.confirmPassError = null;
        this.validate(() => {
            this.validator.confirmPassword(this.info);
            this.tooltip.show('.tooltip-confirmPassword a', this.tooltipDelay);
        }, 3);
    }

    toggle(isCollapsing: boolean) {
        if (!isCollapsing) {
            this.toggleSign();
            this.hideServerError();
        }
    }

    toggleSign() {
        if (this.isSignUp) {
            this.isSignUp = false;
            this.state = 'signIn';
            this.hideAllTooltip();
        } else {
            this.isSignUp = true;
            this.state = 'signUp';
        }
    }

    showAllTooltip(delay = 0) {
        this.tooltip.show('.tooltip-container:not(.d-none) a', delay);
    }

    hideAllTooltip(delay = 0) {
        this.tooltip.hide('.tooltip-container:not(.d-none) a', delay);
    }

    toggleAllTooltip(delay = 0) {
        this.tooltip.toggle('.tooltip-container:not(.d-none) a', delay);
    }

    showServerError() {
        $('.error-message').collapse('show');
    }

    hideServerError() {
        $('.error-message').collapse('hide');
    }
}
