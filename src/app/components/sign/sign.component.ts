import { Component } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition
 } from '@angular/animations';

@Component({
    selector: 'app-sign',
    templateUrl: 'sign.component.html',
    styleUrls: ['sign.component.css'],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({ transform: 'translateY(-100%)', opacity: 0}),
                animate(200)
            ]),
            transition(':leave', [
                animate(200, style({ transform: 'translateY(-100%)', opacity: 0}))
            ])
        ])
    ]
})
export class SignComponent {

    isSignUp = true;
}
