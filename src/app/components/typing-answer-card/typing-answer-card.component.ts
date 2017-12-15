import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

import { Question } from '../../models/question.model';

@Component({
    selector: 'app-typing-answer-card',
    templateUrl: 'typing-answer-card.component.html',
    styleUrls: ['typing-answer-card.component.css']
})
export class TypingAnswerCardComponent implements OnChanges {

    @Input() question: Question;

    @Input() isCorrect: boolean;

    @Output() answer = new EventEmitter<string>();

    value: string;

    submitted: boolean;

    disableSubmit: boolean;

    ngOnChanges(changes: SimpleChanges) {
        if (changes.question || changes.isCorrect.currentValue === null) {
            this.reset();
        }
    }

    reset() {
        this.isCorrect = null;
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
        this.answer.emit(this.value);
    }
}
