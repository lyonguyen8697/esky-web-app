import {
    AnimationTriggerMetadata,
    trigger,
    state,
    style,
    animate,
    transition,
    query,
    animateChild,
    keyframes
 } from '@angular/animations';

export function slideInOut(timing: string = '200ms', translateX = true, translate = '20%', opacity = 0): AnimationTriggerMetadata  {
    if (translateX) {
        return trigger('slideInOut', [
            transition(':enter', [
                style({ transform: 'translateX(' + translate + ')', opacity: opacity}),
                animate(timing)
            ]),
            transition(':leave', [
                animate(timing, style({ transform: 'translateX(-' + translate + ')', opacity: opacity}))
            ])
        ]);
    } else {
        return trigger('slideInOut', [
            transition(':enter', [
                style({ transform: 'translateY(' + translate + ')', opacity: opacity}),
                animate(timing)
            ]),
            transition(':leave', [
                animate(timing, style({ transform: 'translateY(-' + translate + ')', opacity: opacity}))
            ])
        ]);
    }
}
