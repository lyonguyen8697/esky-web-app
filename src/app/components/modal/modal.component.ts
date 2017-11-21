import { Component, OnChanges, SimpleChanges, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';

declare var $: any;

import { ModalService } from '../../services/modal.service';

@Component({
    selector: 'app-modal',
    templateUrl: 'modal.component.html',
    styleUrls: ['modal.component.css']
})

export class ModalComponent implements OnChanges, AfterViewInit {

    @Input() modal: string;

    @Input() title = 'Modal title';

    @Input() fade = true;

    @Input() toggle: boolean;

    @Output() show = new EventEmitter();

    @Output() hide = new EventEmitter();

    @Output() shown = new EventEmitter();

    @Output() hidden = new EventEmitter();

    constructor(private modalService: ModalService) { }

    ngAfterViewInit() {
        this.registerEvent();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.toggle) {
            this.toggleModal();
        }
        if (changes.modal) {
            this.registerEvent();
        }
    }

    toggleModal() {
        if (this.toggle) {
            this.modalService.show(this.modal);
        } else {
            this.modalService.hide(this.modal);
        }
    }

    registerEvent() {
        this.modalService.onShow(this.modal, () => {
            this.show.emit();
        });
        this.modalService.onHide(this.modal, () => {
            this.hide.emit();
        });
        this.modalService.onShown(this.modal, () => {
            this.shown.emit();
        });
        this.modalService.onHidden(this.modal, () => {
            this.hidden.emit();
        });
    }
}
