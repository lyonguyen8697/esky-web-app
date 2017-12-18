import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LessonService } from '../../services/lesson.service';
import { ModalService } from '../../services/modal.service';
import { Lesson } from '../../models/lesson.model';

@Component({
    templateUrl: 'lessons-manager.component.html',
    styleUrls: ['lessons-manager.component.css']
})

export class LessonsManagerComponent implements OnInit {

    lessons: Lesson[];

    selected: Lesson;

    filter: any;

    showDeleted: boolean;

    search: string;

    submiting: boolean;

    confirmModal = 'confirmModal';

    confirmOk: Function;

    confirmCancel: Function;

    confirmContent: string;

    responseModal = 'responseModal';

    serverError: string;

    constructor(private router: Router,
                private lessonService: LessonService,
                private modal: ModalService) { }

    ngOnInit() {
        this.showDeleted = false;
        this.filterChanged();

        this.submiting = false;

        this.lessonService.getAll()
            .subscribe(lessons => {
                this.lessons = lessons;
            });
    }

    filterChanged() {
        this.filter = {
            deleted: this.showDeleted ? undefined : false
        };
        this.selected = null;
    }

    rowClicked(lesson: Lesson) {
        if (this.submiting) {
            return;
        }
        if (this.isSelected(lesson)) {
            this.selected = null;
        } else {
            this.selected = lesson;
        }
    }

    isSelected(lesson: Lesson): boolean {
        return this.selected === lesson;
    }

    gotoLessonCreator() {
        if (this.selected) {
            this.router.navigate(['creator', 'lesson', this.selected.id]);
        }
    }

    gotoLessonStudy() {
        if (this.selected) {
            this.router.navigate(['study', 'lesson', this.selected.id]);
        }
    }

    deleteButtonClicked() {
        this.confirm({
            content: `Bạn có muốn xóa bài học #${this.lessons.indexOf(this.selected)} không ?`,
            ok: () => {
                this.hideModal(this.confirmModal);
                this.delete();
            },
            cancel: () => this.hideModal(this.confirmModal)
        });
    }

    restoreButtonClicked() {
        this.confirm({
            content: `Bạn có muốn khôi phục bài học #${this.lessons.indexOf(this.selected)} không ?`,
            ok: () => {
                this.hideModal(this.confirmModal);
                this.restore();
            },
            cancel: () => this.hideModal(this.confirmModal)
        });
    }

    responseModalAccept() {
        this.submiting = false;
        this.serverError = '';
    }

    responseModalAcceptButtonClicked() {
        this.hideModal(this.responseModal);
        this.responseModalAccept();
    }

    delete() {
        this.submiting = true;
        this.lessonService.delete(this.selected.id)
            .subscribe(error => {
                if (!error.message) {
                    this.selected.deleted = true;
                    this.selected = null;
                    this.refreshPresentation();
                } else {
                    this.serverError = error.message;
                }
                this.showModal(this.responseModal);
            });
    }

    restore() {
        this.submiting = true;
        this.lessonService.restore(this.selected.id)
            .subscribe(error => {
                if (!error.message) {
                    this.selected.deleted = false;
                    this.refreshPresentation();
                } else {
                    this.serverError = error.message;
                }
                this.showModal(this.responseModal);
            });
    }

    refreshPresentation() {
        const lessons = this.lessons;
        this.lessons = [];
        window.setTimeout(() => this.lessons = lessons);
    }

    confirm(option: { content, ok: Function, cancel: Function }) {
        this.confirmContent = option.content;
        this.confirmOk = option.ok;
        this.confirmCancel = option.cancel;
        this.showModal(this.confirmModal);
    }

    showModal(modal: string) {
        this.modal.show(modal);
    }

    hideModal(modal: string) {
        this.modal.hide(modal);
    }
}
