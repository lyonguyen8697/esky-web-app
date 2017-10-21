import {
    AnimationTriggerMetadata,
    trigger,
    state,
    style,
    animate,
    transition,
    keyframes
 } from '@angular/animations';

export function rotateInOut(timing: number): AnimationTriggerMetadata  {
    return trigger('rotateInOut', [
        transition(':enter', [
            style({ transform: 'rotateX(90deg)'}),
            animate(timing + 'ms ' + timing + 'ms')
        ]),
        transition(':leave', [
            animate(timing, style({ transform: 'rotateX(90deg)'}))
        ])
    ]);
}
