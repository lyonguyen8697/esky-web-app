import { Component } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition,
    keyframes
 } from '@angular/animations';

 import { AuthenticationService } from '../../services/authentication.service';
 import { User } from '../../models/user.model';

@Component({
    selector: 'app-sign',
    templateUrl: 'sign.component.html',
    styleUrls: ['sign.component.css'],
    animations: [
        trigger('rotateInOut', [
            transition(':enter', [
                style({ transform: 'rotateX(90deg)'}),
                animate('200ms 200ms')
            ]),
            transition(':leave', [
                animate(200, style({ transform: 'rotateX(90deg)'}))
            ])
        ]),
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
            state('signUp', style({ 'background-color': '#28a745', 'border-color': '#28a745'})),
            transition('signUp <=> signIn', [
                animate(400)
            ])
        ])
    ]
})
export class SignComponent {

    private isSignUp = true;

    private state = 'signUp';

    private stateName = 'Dang Ky';

    private isDone = true;

    private user = new User();

    constructor(private authService: AuthenticationService) { }

    private sign() {
        if (this.isSignUp) {
            this.signUp();
        } else {
            this.signIn();
        }
    }

    private signUp() {

    }

    private signIn() {
        this.authService.signIn(this.user.email, this.user.password);
        console.log(this.user);
    }

    private toggle() {
        if (this.isDone) {
            this.isDone = false;
            this.toggleSign();
            setTimeout(() => this.isDone = true, 200);
        }
    }

    private toggleSign() {
        this.isSignUp = !this.isSignUp;
        this.state = this.state === 'signUp' ? 'signIn' : 'signUp';
        this.stateName = this.state === 'signUp' ? 'Dang Ky' : 'Dang Nhap';
    }
}
