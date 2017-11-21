import { Injectable } from '@angular/core';

declare var $: any;

@Injectable()
export class ModalService {

    constructor() { }

    show(modal: string) {
        $(`#${modal}`).modal('show');
    }

    hide(modal: string) {
        $(`#${modal}`).modal('hide');
    }

    toggle(modal: string) {
        $(`#${modal}`).modal('toggle');
    }

    onShow(modal: string, handler: Function) {
        $(`#${modal}`).on('show.bs.modal', e => {
            handler();
        });
    }

    onShown(modal: string, handler: Function) {
        $(`#${modal}`).on('shown.bs.modal', e => {
            handler();
        });
    }

    onHide(modal: string, handler: Function) {
        $(`#${modal}`).on('hide.bs.modal', e => {
            handler();
        });
    }

    onHidden(modal: string, handler: Function) {
        $(`#${modal}`).on('hidden.bs.modal', e => {
            handler();
        });
    }
}
