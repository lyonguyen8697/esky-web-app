import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { QuestionService } from '../../services/question.service';
import { SpeechService } from '../../services/speech.service';
import { AudioService } from '../../services/audio.service';
import { ModalService } from '../../services/modal.service';
import { Question } from '../../models/question.model';

@Component({
    templateUrl: 'questions-manager.component.html',
    styleUrls: ['questions-manager.component.css']
})
export class QuestionsManagerComponent implements OnInit {

    questions: Question[];

    selected: Question;

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

    previewQuestion: Question;

    previewModal = 'previewModal';

    isPreviewCorrect: boolean;

    constructor(private router: Router,
        private questionService: QuestionService,
        private speech: SpeechService,
        private audio: AudioService,
        private modal: ModalService) { }

    ngOnInit() {
        this.showDeleted = false;
        this.filterChanged();

        this.submiting = false;

        this.questionService.getAll()
            .subscribe(questions => {
                this.questions = questions;
            });
    }

    filterChanged() {
        this.filter = {
            deleted: this.showDeleted ? undefined : false
        };
        this.selected = null;
    }

    rowClicked(question: Question) {
        if (this.submiting) {
            return;
        }
        if (this.isSelected(question)) {
            this.selected = null;
        } else {
            this.selected = question;
        }
    }

    speak(event: MouseEvent, voice: string) {
        this.speech.speak(voice);
        event.stopPropagation();
    }

    isSelected(question: Question): boolean {
        return this.selected === question;
    }

    gotoQuestionCreator() {
        if (this.selected) {
            this.router.navigate(['creator', 'question', this.selected.id]);
        }
    }

    deleteButtonClicked() {
        this.confirm({
            content: `Bạn có muốn xóa câu hỏi #${this.questions.indexOf(this.selected)} không ?`,
            ok: () => {
                this.hideModal(this.confirmModal);
                this.delete();
            },
            cancel: () => this.hideModal(this.confirmModal)
        });
    }

    restoreButtonClicked() {
        this.confirm({
            content: `Bạn có muốn khôi phục câu hỏi #${this.questions.indexOf(this.selected)} không ?`,
            ok: () => {
                this.hideModal(this.confirmModal);
                this.restore();
            },
            cancel: () => this.hideModal(this.confirmModal)
        });
    }

    previewButtonClicked() {
        if (this.selected) {
            this.previewQuestion = this.selected;
            this.isPreviewCorrect = null;
            this.showModal(this.previewModal);
        }
    }

    answerPreviewQuestion(answer: string) {
        if (this.questionService.checkAnswer(this.previewQuestion, answer)) {
            this.isPreviewCorrect = true;
            this.audio.play(this.audio.correct);
        } else {
            this.isPreviewCorrect = false;
            this.audio.play(this.audio.wrong);
        }
        window.setTimeout(() => this.hideModal(this.previewModal), 1000);
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
        this.questionService.delete(this.selected.id)
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
        this.questionService.restore(this.selected.id)
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
        const questions = this.questions;
        this.questions = [];
        window.setTimeout(() => this.questions = questions);
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
