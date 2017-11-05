import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Question } from '../../models/question.model';

@Component({
    selector: 'app-typing-answer-card',
    templateUrl: 'typing-answer-card.component.html',
    styleUrls: ['typing-answer-card.component.css']
})
export class TypingAnswerCardComponent {

    @Input() question: Question;

    @Output() answer = new EventEmitter<boolean>();

    value: string;

    isCorrect: boolean;

    disableCheck = true;

    valueChange() {
        if (this.value.trim()) {
            this.disableCheck = false;
        } else {
            this.disableCheck = true;
        }
    }

    submit(event) {
        if (event) {
            event.preventDefault();
        }
        if (this.value.trim().toLowerCase() === this.question.answer.trim().toLowerCase()) {
            this.isCorrect = true;
            this.answer.emit(true);
        } else {
            this.isCorrect = false;
            this.answer.emit(false);
        }
    }
}
