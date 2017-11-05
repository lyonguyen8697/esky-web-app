import {
    AnimationTriggerMetadata,
    trigger,
    state,
    style,
    animate,
    transition,
    keyframes
 } from '@angular/animations';

export function rotateInOut(timing: string): AnimationTriggerMetadata  {
    return trigger('rotateInOut', [
        transition(':enter', [
            style({ transform: 'rotateX(90deg)'}),
            animate(timing + ' ' + timing)
        ]),
        transition(':leave', [
            animate(timing, style({ transform: 'rotateX(90deg)'}))
        ])
    ]);
}
