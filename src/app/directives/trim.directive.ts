import { Directive, ElementRef, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[trim]'
})
export class TrimDirective {

    get value() {
        return this._elementRef.nativeElement.value;
    }

    set value(value: string) {
        this._elementRef.nativeElement.value = value;
    }

    constructor(private _elementRef: ElementRef) {}

    @HostListener('blur')
    onBlur() {
        this.value = this.value.trim();
    }
}
