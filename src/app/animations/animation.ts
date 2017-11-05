import {
    trigger,
    transition,
    query,
    animateChild,
 } from '@angular/animations';

export const animation = trigger('animation', [
    transition(':enter, :leave', [
        query('@*', animateChild())
    ])
]);
