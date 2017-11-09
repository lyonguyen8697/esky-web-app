import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { Question } from '../../models/question.model';

@Component({
    selector: 'app-typing-answer-card',
    templateUrl: 'typing-answer-card.component.html',
    styleUrls: ['typing-answer-card.component.css']
})
export class TypingAnswerCardComponent implements OnChanges {

    @Input() question: Question;

    @Output() answer = new EventEmitter<boolean>();

    value: string;

    isCorrect: boolean;

    submitted: boolean;

    disableSubmit: boolean;

    ngOnChanges() {
        this.reset();
    }

    reset() {
        this.submitted = false;
        this.value = '';
        this.disableSubmit = true;
    }

    valueChange() {
        if (this.value.trim()) {
            this.disableSubmit = false;
        } else {
            this.disableSubmit = true;
        }
    }

    submit(event) {
        this.submitted = true;
        if (event) {
            event.preventDefault();
        }
        if (this.checkAnswer(this.value)) {
            this.isCorrect = true;
            this.answer.emit(true);
        } else {
            this.isCorrect = false;
            this.answer.emit(false);
        }
    }

    checkAnswer(answer: string): boolean {
        return this.question.answers.includes(answer);
    }
}
