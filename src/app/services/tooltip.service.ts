import { Injectable } from '@angular/core';

declare var $: any;

@Injectable()
export class TooltipService {

    init(selector: string) {
        $(selector).tooltip();
    }

    show(selector: string, delay = 0) {
        setTimeout(() => $(selector).tooltip('show'), delay);
    }

    hide(selector: string, delay = 0) {
        setTimeout(() => $(selector).tooltip('hide'), delay);
    }

    toggle(selector: string, delay = 0) {
        setTimeout(() => $(selector).tooltip('toggle'), delay);
    }

    dispose(selector: string, delay = 0) {
        setTimeout(() => $(selector).tooltip('dispose'), delay);
    }

    enable(selector: string, delay = 0) {
        setTimeout(() => $(selector).tooltip('enable'), delay);
    }

    disable(selector: string, delay = 0) {
        setTimeout(() => $(selector).tooltip('disable'), delay);
    }

    toggleEnabled(selector: string, delay = 0) {
        setTimeout(() => $(selector).tooltip('toggleEnabled'), delay);
    }

    update(selector: string, delay = 0) {
        setTimeout(() => $(selector).tooltip('update'), delay);
    }
}
