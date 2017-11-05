import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[clickOutside]'
})
export class ClickOutsideDirective {

    @Output() clickOutside = new EventEmitter<MouseEvent>();

    constructor(private _elementRef: ElementRef) {}

    @HostListener('document:click', ['$event', '$event.target'])
    onGlobalClick(event: MouseEvent, target: HTMLElement) {
        if (!target) {
            return;
        }
        if (!this._elementRef.nativeElement.contains(target)) {
            this.clickOutside.emit(event);
        }
    }
}
