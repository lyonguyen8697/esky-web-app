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

export function slideInOut({
    name = 'slideInOut',
    stateIn = '*',
    stateOut = 'void',
    slideIn = true,
    slideOut = true,
    timing = '200ms',
    translateX = false,
    translate = '20%',
    opacity = 0
}): AnimationTriggerMetadata  {
    const transitions: any = [
        state(stateOut, style({
            transform: translateX ? 'translateX(' : 'translateY(' + translate + ')',
            opacity: opacity
        }))
    ];
    if (slideIn) {
        transitions.push(transition(stateOut + ' => ' + stateIn, animate(timing)));
    }
    if (slideOut) {
        transitions.push(transition(stateIn + ' => ' + stateOut, animate(timing)));
    }
    return trigger(name, transitions);
}
